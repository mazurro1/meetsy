import Product from "@/models/Product/product";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidUserSuperAdmin,
  findValidUserSuperAdminWithPassword,
} from "@lib";
import type {TypeProductMethod} from "@/models/Product/product.model";
import Stripe from "stripe";
import {TYPES_OF_METHOD} from "@/models/Product/product.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const createProduct = async (
  userEmail: string,
  method: TypeProductMethod,
  userPassword: string,
  name: string,
  description: string,
  reneving: number | null,
  price: number,
  points: number,
  premium: number,
  sms: number,
  promotion: boolean,
  isActive: boolean,
  dateStart: string,
  dateEnd: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserSuperAdminWithPassword({
      userEmail: userEmail,
      select: "_id password",
      adminPassword: userPassword,
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const newProductStripe = await stripe.products.create({
      name: name,
      description: description,
      default_price_data: {
        unit_amount: price * 100,
        currency: "pln",
        recurring:
          method === "subscription" && reneving
            ? {
                interval_count: reneving,
                interval: "month",
              }
            : undefined,
        tax_behavior: "exclusive",
      },
      shippable: false,
      active: true,
      metadata: {
        createdUserId: findedUser._id.toString(),
        points: points,
        premium: premium,
        sms: sms,
        method: method,
        promotion: promotion.toString(),
        dateStart: dateStart,
        dateEnd: !!dateEnd ? dateEnd : null,
        reneving: !!reneving ? reneving : null,
        isActive: isActive.toString(),
      },
    });

    if (!!!newProductStripe) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
    const newProduct = new Product({
      name: newProductStripe.name,
      description: newProductStripe.description,
      method: newProductStripe.metadata.method,
      price: price,
      promotionPrice: null,
      platformPointsCount: points,
      platformSubscriptionMonthsCount: premium,
      platformSMSCount: sms,
      stripePriceId: newProductStripe.default_price,
      stripeProductId: newProductStripe.id,
      isAcitve: newProductStripe.metadata.isActive === "true" ? true : false,
      promotion: newProductStripe.metadata.promotion === "true" ? true : false,
      dateStart: !!newProductStripe.metadata.dateStart
        ? newProductStripe.metadata.dateStart
        : null,
      dateEnd: !!newProductStripe.metadata.dateEnd
        ? newProductStripe.metadata.dateEnd
        : null,
      reneving: newProductStripe.metadata.reneving,
      isArchived: false,
    });

    const savedProduct = await newProduct.save();

    if (!!!savedProduct) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        subscription: savedProduct,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const getProductsAdmin = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserSuperAdmin({
      userEmail: userEmail,
      select: "_id",
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const allProducts = await Product.find({
      method: {$in: TYPES_OF_METHOD},
      isArchived: false,
    });

    if (!!!allProducts) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        products: allProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const updateProduct = async (
  userEmail: string,
  productId: string,
  userPassword: string,
  name: string,
  description: string,
  reneving: number | null,
  points: number,
  premium: number,
  sms: number,
  promotion: boolean,
  isActive: boolean,
  dateStart: string,
  dateEnd: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserSuperAdminWithPassword({
      userEmail: userEmail,
      select: "_id password",
      adminPassword: userPassword,
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findProduct = await Product.findOne({
      _id: productId,
    });

    if (!!!findProduct) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!findProduct?.stripeProductId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const editedProductStripe = await stripe.products.update(
      findProduct.stripeProductId,
      {
        name: name,
        description: description,
        metadata: {
          isActive: isActive.toString(),
          points: points,
          premium: premium,
          sms: sms,
          promotion: promotion.toString(),
          dateStart: dateStart,
          dateEnd: !!dateEnd ? dateEnd : null,
          reneving: !!reneving ? reneving : null,
        },
      }
    );

    if (!!!editedProductStripe) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    findProduct.name = editedProductStripe.name;
    findProduct.description = editedProductStripe.description;
    findProduct.isAcitve =
      editedProductStripe.metadata.isActive === "true" ? true : false;
    findProduct.platformPointsCount = !!editedProductStripe.metadata.points
      ? Number(editedProductStripe.metadata.points)
      : null;
    findProduct.platformSubscriptionMonthsCount = !!editedProductStripe.metadata
      .premium
      ? Number(editedProductStripe.metadata.premium)
      : null;
    findProduct.platformSMSCount = !!editedProductStripe.metadata.sms
      ? Number(editedProductStripe.metadata.sms)
      : null;
    findProduct.promotion =
      editedProductStripe.metadata.promotion === "true" ? true : false;
    findProduct.dateStart = !!editedProductStripe.metadata.dateStart
      ? editedProductStripe.metadata.dateStart
      : null;
    findProduct.dateEnd = !!editedProductStripe.metadata.dateEnd
      ? editedProductStripe.metadata.dateEnd
      : null;
    findProduct.reneving = !!editedProductStripe.metadata.reneving
      ? Number(editedProductStripe.metadata.reneving)
      : null;

    const savedProduct = await findProduct.save();

    if (!!!savedProduct) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        product: savedProduct,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const deleteProduct = async (
  userEmail: string,
  productId: string,
  userPassword: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserSuperAdminWithPassword({
      userEmail: userEmail,
      select: "_id password",
      adminPassword: userPassword,
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findProduct = await Product.findOne({
      _id: productId,
      isArchived: false,
    });

    if (!!!findProduct) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!findProduct?.stripeProductId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const editedProductStripe = await stripe.products.update(
      findProduct.stripeProductId,
      {
        active: false,
        metadata: {
          isActive: "false",
        },
      }
    );

    if (!!!editedProductStripe) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    findProduct.isArchived = !!!editedProductStripe.active;
    findProduct.isAcitve =
      editedProductStripe.metadata.isActive === "true" ? true : false;

    const savedProduct = await findProduct.save();

    if (!!!savedProduct) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        productId: savedProduct._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
