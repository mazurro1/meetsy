import Product from "@/models/Product/product";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {formatAmountForStripe} from "@/utils/stripe-helpers";
import {CURRENCY} from "../../config/Stripe";
import {findValidCompany} from "@lib";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const createPayment = async (
  userEmail: string,
  companyId: string,
  productsId: string[],
  urlCheckout: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findCompany = await findValidCompany({
      companyId: companyId,
      select: "_id stripeCustomerId",
    });

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const allProducts = await Product.find({
      _id: {$in: productsId},
    }).limit(50);

    if (!!!allProducts) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const hasProductOnlyToPay: boolean = allProducts.some(
      (item) => item.method === "payment"
    );

    const mapItems = allProducts.map((item) => {
      if (hasProductOnlyToPay) {
        return {
          price: !!item.stripePriceId ? item.stripePriceId : undefined,
          quantity: 1,
        };
      } else {
        return {
          price: !!item.stripePriceId ? item.stripePriceId : undefined,
          quantity: 1,
        };
      }
    });

    if (!!!findCompany?.stripeCustomerId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: hasProductOnlyToPay ? ["card", "p24"] : ["card"],
      line_items: mapItems,
      customer: findCompany.stripeCustomerId,
      success_url: `${urlCheckout}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${urlCheckout}/account/companys/edit/${companyId}`,
      mode: hasProductOnlyToPay ? "payment" : "subscription",
      metadata: {
        companyId: findCompany._id.toString(),
      },
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: hasProductOnlyToPay ? false : true,
      },
      tax_id_collection: {
        enabled: true,
      },
      billing_address_collection: "required",
      customer_update: {
        name: "auto",
      },
    };

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    if (!!!checkoutSession.id) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    // dodaj generowanie produktu

    return res.status(200).json({
      success: true,
      data: {
        checkoutSession: checkoutSession,
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
