import Product from "@/models/Product/product";
import Coupon from "@/models/Coupon/coupon";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidUserSuperAdmin,
  findValidUserSuperAdminWithPassword,
} from "@lib";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const createCoupon = async (
  userEmail: string,
  userPassword: string,
  name: string,
  packagesIds: string[],
  discount: number,
  limit: number | null,
  isActive: boolean,
  dateStart: string,
  dateEnd: string,
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

    const findProducts = await Product.find({
      _id: {
        $in: packagesIds,
      },
    }).select("_id stripeProductId");

    const dateEndTimestamp = new Date(dateEnd);

    const mapProductsStripeId: string[] = findProducts.map((item) =>
      !!item.stripeProductId ? item.stripeProductId : ""
    );

    const newCouponStripe = await stripe.coupons.create({
      percent_off: discount,
      duration: "once",
      name: name,
      applies_to: {
        products: mapProductsStripeId,
      },
      max_redemptions: !!limit ? limit : undefined,
      redeem_by: dateEndTimestamp.getTime() / 1000,
      metadata: {
        userCreated: findedUser._id,
        dateStart: dateStart,
        dateEnd: dateEnd,
        isActive: isActive.toString(),
        isArchived: false.toString(),
      },
    });

    if (!!!newCouponStripe) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const promotionCode = await stripe.promotionCodes.create({
      coupon: newCouponStripe.id,
      code: !!newCouponStripe?.name ? newCouponStripe.name : undefined,
      active: newCouponStripe?.metadata?.isActive === "true" ? true : false,
      expires_at: !!newCouponStripe?.redeem_by
        ? newCouponStripe.redeem_by
        : undefined,
      max_redemptions: !!newCouponStripe?.max_redemptions
        ? newCouponStripe.max_redemptions
        : undefined,
    });

    if (!!!promotionCode) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const newCoupon = new Coupon({
      name: newCouponStripe.name,
      discount: newCouponStripe.percent_off,
      dateStart: !!newCouponStripe?.metadata?.dateStart
        ? newCouponStripe.metadata.dateStart
        : null,
      dateEnd: !!newCouponStripe?.metadata?.dateEnd
        ? newCouponStripe.metadata.dateEnd
        : null,
      isAcitve: newCouponStripe?.metadata?.isActive === "true" ? true : false,
      products: packagesIds,
      limit: newCouponStripe.max_redemptions,
      couponStripeId: newCouponStripe.id,
      promotionCodeStripeId: promotionCode.id,
      isArchived: false,
    });

    const savedCoupon = await newCoupon.save();

    if (!!!savedCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const populatesSavedCoupon = await savedCoupon.populate("products");

    if (!!!populatesSavedCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        coupon: populatesSavedCoupon,
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

export const getCouponAdmin = async (
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

    const allCoupons = await Coupon.find({
      isArchived: false,
    }).populate("products");

    if (!!!allCoupons) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        coupons: allCoupons,
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

export const updateCoupon = async (
  userEmail: string,
  productId: string,
  userPassword: string,
  isActive: boolean,
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

    const findCoupon = await Coupon.findOne({
      _id: productId,
    });

    if (!!!findCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!findCoupon?.couponStripeId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!findCoupon?.promotionCodeStripeId || !!!findCoupon?.couponStripeId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const updatedCouponStripe = await stripe.coupons.update(
      findCoupon.couponStripeId,
      {
        metadata: {isActive: isActive.toString()},
      }
    );

    const editedPromotionCodeStripe = await stripe.promotionCodes.update(
      findCoupon.promotionCodeStripeId,
      {
        active:
          updatedCouponStripe?.metadata?.isActive === "true" ? true : false,
      }
    );

    if (!!!editedPromotionCodeStripe) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    findCoupon.isAcitve =
      updatedCouponStripe?.metadata?.isActive === "true" ? true : false;

    const savedCoupon = await findCoupon.save();
    const populatedSavedCoupon = await findCoupon.populate("products");

    if (!!!savedCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        coupon: populatedSavedCoupon,
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

export const deleteCoupon = async (
  userEmail: string,
  couponId: string,
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

    const findCoupon = await Coupon.findOne({
      _id: couponId,
      isArchived: false,
    });

    if (!!!findCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!findCoupon?.promotionCodeStripeId || !!!findCoupon?.couponStripeId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const updatedCouponStripe = await stripe.coupons.update(
      findCoupon.couponStripeId,
      {
        metadata: {
          isActive: "false",
          isArchived: "true",
        },
      }
    );

    const editedPromotionCodeStripe = await stripe.promotionCodes.update(
      findCoupon.promotionCodeStripeId,
      {
        active: false,
      }
    );

    if (!!!editedPromotionCodeStripe) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    findCoupon.isArchived = !!!editedPromotionCodeStripe.active;
    findCoupon.isAcitve =
      updatedCouponStripe?.metadata?.isActive === "true" ? true : false;

    const savedCoupon = await findCoupon.save();

    if (!!!savedCoupon) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        couponId: savedCoupon._id,
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
