import Product from "@/models/Product/product";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {findValidUser} from "@lib";
import type {TypeProductMethod} from "@/models/Product/product.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const createProduct = async (
  userEmail: string,
  method: TypeProductMethod,
  price: number,
  promotionPrice: number,
  platformPointsCount: number,
  platformSubscriptionMonthsCount: number,
  platformSMSCount: number,
  stripePriceId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUser({
      userEmail: userEmail,
      select: "_id",
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const newProductStripe = await stripe.products.create({
      name: "Basic Dashboard",
      description: "",
      shippable: false,
      default_price_data: {
        unit_amount: 1000,
        currency: "pln",
        // recurring: false,
        recurring: {
          interval_count: 3, // ilość powtórzeń subskrypcji
          interval: "month", // okres rozliczeń
        },
        tax_behavior: "exclusive",
      },
      images: [""],
      expand: ["default_price"],
      active: true,
    });

    const newProduct = new Product({
      method: method,
      price: price,
      promotionPrice: promotionPrice,
      platformPointsCount: platformPointsCount,
      platformSubscriptionMonthsCount: platformSubscriptionMonthsCount,
      platformSMSCount: platformSMSCount,
      stripePriceId: stripePriceId,
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
        product: savedProduct,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
