import Product from "@/models/Product/product";
import Payment from "@/models/Payment/payment";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  findValidCompany,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
} from "@lib";
import Coupon from "@/models/Coupon/coupon";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const createPayment = async (
  userEmail: string,
  companyId: string,
  productId: string,
  promotionCode: string | null,
  urlCheckout: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findValidUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!!!findValidUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

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

    let findCoupon = null;

    if (!!promotionCode) {
      findCoupon = await Coupon.findOne({
        isAcitve: true,
        isArchived: false,
        name: promotionCode.toUpperCase(),
        dateEnd: {
          $gte: new Date(),
        },
        products: findProduct._id?.toString(),
      });
    }

    const hasProductOnlyToPay: boolean = findProduct?.method === "payment";

    const buingItem = {
      price: !!findProduct?.stripePriceId
        ? findProduct.stripePriceId
        : undefined,
      quantity: 1,
    };

    if (!!!findCompany?.stripeCustomerId) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const itemStatus = {
      value: "draft",
      date: new Date().toString(),
    };

    const newPayment = new Payment({
      companyId: findCompany._id.toString(),
      couponId: !!findCoupon ? findCoupon._id?.toString() : null,
      productId: findProduct.id,
      userId: findValidUser._id,
      status: [itemStatus],
      stripeLinkInvoice: [],
    });

    const savedDraftPayment = await newPayment.save();

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: hasProductOnlyToPay ? ["card", "p24"] : ["card"],
        line_items: [buingItem],
        customer: findCompany.stripeCustomerId,
        success_url: `${urlCheckout}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${urlCheckout}/account/companys/edit/${companyId}`,
        mode: hasProductOnlyToPay ? "payment" : "subscription",
        metadata: {
          companyId: findCompany._id.toString(),
          userId: findValidUser._id.toString(),
          paymentId: newPayment!._id!.toString(),
        },
        automatic_tax: {
          enabled: true,
        },
        tax_id_collection: {
          enabled: true,
        },
        customer_update: {
          name: "auto",
          address: "auto",
          shipping: "auto",
        },
        discounts: !!findCoupon
          ? [
              {
                promotion_code: !!findCoupon?.promotionCodeStripeId
                  ? findCoupon.promotionCodeStripeId
                  : "",
              },
            ]
          : undefined,
        payment_intent_data: hasProductOnlyToPay
          ? {
              metadata: {
                companyId: findCompany._id.toString(),
                userId: findValidUser._id.toString(),
                paymentId: newPayment!._id!.toString(),
              },
            }
          : undefined,
        subscription_data: !hasProductOnlyToPay
          ? {
              metadata: {
                companyId: findCompany._id.toString(),
                userId: findValidUser._id.toString(),
                paymentId: newPayment!._id!.toString(),
              },
            }
          : undefined,
      });

    savedDraftPayment.expiresAt = checkoutSession.expires_at * 1000;
    savedDraftPayment.stripeCheckoutId = checkoutSession.id;
    savedDraftPayment.stripeCheckoutUrl = checkoutSession.url;
    if (!!checkoutSession?.payment_intent) {
      savedDraftPayment.stripePaymentIntentId =
        checkoutSession.payment_intent.toString();
    }

    await savedDraftPayment.save();

    if (!!!checkoutSession?.id) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!!newPayment) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

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

export const getCompanyPayments = async (
  userEmail: string,
  page: number,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const limit: number = 10;

    const findValidUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!!!findValidUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

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

    const findPayments = await Payment.find({
      companyId: companyId,
    })
      .populate("productId couponId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({createdAt: -1});

    return res.status(200).json({
      success: true,
      data: {
        payments: findPayments,
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
