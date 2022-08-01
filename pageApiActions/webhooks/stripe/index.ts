import type {NextApiResponse} from "next";
import type {DataWebhookStripe} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {SendEmail, findValidCompany, findValidUserId} from "@lib";
import Payment from "@/models/Payment/payment";
import Company from "@/models/Company/company";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const paymentFailure = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataWebhookStripe>,
  customerStripeId: string,
  paymentId: string
) => {
  try {
    const savedPayment = await Payment.updateOne(
      {
        stripePaymentIntentId: paymentId,
      },
      {
        $set: {
          status: "failure_payment",
        },
      }
    );

    const selectedCompany = await findValidCompany({
      companyId: null,
      select: "_id email companyDetails.name",
      query: {stripeCustomerId: customerStripeId},
    });

    const findPayment = await Payment.findOne({
      stripePaymentIntentId: paymentId,
    }).select("_id userId");

    if (!!!selectedCompany || !!!findPayment) {
      console.log(1);
      return res.json({received: false});
    }

    if (!!!findPayment?.userId) {
      console.log(2);
      return res.json({received: false});
    }

    const selectedUser = await findValidUserId({
      _id: findPayment?.userId?.toString(),
      select: "_id email",
    });

    if (!!!selectedUser) {
      console.log(3);
      return res.json({received: false});
    }

    await SendEmail({
      userEmail: selectedUser.email,
      emailTitle:
        AllTexts?.StripeWebhook?.[validContentLanguage]?.paymentFailureTitle,
      emailContent: `${
        AllTexts?.StripeWebhook?.[validContentLanguage]?.paymentFailureContent
      } ${selectedCompany.companyDetails.name?.toUpperCase()}`,
    });

    if (!!selectedCompany.email) {
      if (selectedUser.email !== selectedCompany.email) {
        await SendEmail({
          userEmail: selectedCompany.email,
          emailTitle:
            AllTexts?.StripeWebhook?.[validContentLanguage]
              ?.paymentFailureTitle,
          emailContent: `${
            AllTexts?.StripeWebhook?.[validContentLanguage]
              ?.paymentFailureContent
          } ${selectedCompany.companyDetails.name?.toUpperCase()}`,
        });
      }
    }
    console.log("success failure");
    return res.json({received: true});
  } catch (error) {
    console.log(error);
    return res.json({received: false});
  }
};

export const subscriptionSuccess = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataWebhookStripe>,
  customerStripeId: string,
  subscriptionId: string,
  invoiceUrl: string
) => {
  try {
    const findPayment = await Payment.findOne({
      stripeSubscriptionId: subscriptionId,
    }).populate(
      "userId companyId productId",
      "_id email companyDetails.name platformPointsCount platformSubscriptionMonthsCount platformSMSCount"
    );

    if (!!!findPayment) {
      return res.json({received: false});
    }

    if (!!!findPayment?.userId || !!!findPayment?.companyId) {
      return res.json({received: false});
    }

    if (
      typeof findPayment?.userId === "string" ||
      typeof findPayment?.companyId === "string" ||
      typeof findPayment?.productId === "string"
    ) {
      return res.json({received: false});
    }

    const pointsCount: number = !!findPayment?.productId?.platformPointsCount
      ? findPayment?.productId?.platformPointsCount
      : 0;
    const smsCount: number = !!findPayment?.productId?.platformSMSCount
      ? findPayment?.productId?.platformSMSCount
      : 0;
    const premiumCount: number = !!findPayment?.productId
      ?.platformSubscriptionMonthsCount
      ? findPayment?.productId?.platformSubscriptionMonthsCount
      : 0;

    const bulkArrayToUpdate = [];

    if (!!smsCount) {
      bulkArrayToUpdate.push({
        updateOne: {
          filter: {
            _id: findPayment?.companyId?._id,
          },
          update: {
            $inc: {sms: smsCount},
          },
        },
      });
    }

    if (!!pointsCount) {
      bulkArrayToUpdate.push({
        updateOne: {
          filter: {
            _id: findPayment?.companyId?._id,
          },
          update: {
            $inc: {points: pointsCount},
          },
        },
      });
    }

    if (!!premiumCount) {
      bulkArrayToUpdate.push({
        updateOne: {
          filter: {
            _id: findPayment?.companyId?._id,
            subscriptiopnEndDate: {$exists: true},
          },
          update: [
            {
              $set: {
                subscriptiopnEndDate: {
                  $add: [
                    "$subscriptiopnEndDate",
                    1000 * 60 * 60 * 24 * 30 * premiumCount,
                  ],
                },
              },
            },
          ],
        },
      });
    }
    await Company.bulkWrite(bulkArrayToUpdate);

    if (!!findPayment?.userId?.email) {
      await SendEmail({
        userEmail: findPayment.userId.email,
        emailTitle:
          AllTexts?.StripeWebhook?.[validContentLanguage]?.paymentSuccessTitle,
        emailContent: `${
          AllTexts?.StripeWebhook?.[validContentLanguage]?.paymentSuccessContent
        } ${findPayment?.companyId?.companyDetails?.name?.toUpperCase()}`,
      });
    }

    if (!!findPayment?.companyId?.email) {
      if (findPayment.userId.email !== findPayment?.companyId?.email) {
        await SendEmail({
          userEmail: findPayment?.companyId?.email,
          emailTitle:
            AllTexts?.StripeWebhook?.[validContentLanguage]
              ?.paymentSuccessTitle,
          emailContent: `${
            AllTexts?.StripeWebhook?.[validContentLanguage]
              ?.paymentSuccessContent
          } ${findPayment?.companyId?.companyDetails?.name?.toUpperCase()}`,
        });
      }
    }

    const itemStatus = {
      value: "paid",
      date: new Date().toString(),
    };

    if (!!invoiceUrl) {
      const itemInvoice = {
        url: invoiceUrl,
        date: new Date().toString(),
      };

      findPayment.stripeLinkInvoice.push(itemInvoice as any);
    }

    findPayment.status.push(itemStatus as any);
    findPayment.stripeCheckoutUrl = null;
    findPayment.stripeCheckoutId = null;

    await findPayment.save();

    return res.json({received: true});
  } catch (error) {
    console.log(error);
    return res.json({received: false});
  }
};

export const updatePayment = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataWebhookStripe>,
  companyId: string,
  paymentId: string,
  subscriptionId: string | null,
  mode: string,
  paymentIntentId: string | null
) => {
  try {
    if (mode === "payment") {
      const findPayment = await Payment.findOne({
        _id: paymentId,
        companyId: companyId,
      }).populate("companyId couponId productId");

      if (!!!findPayment) {
        return res.json({received: false});
      }

      if (
        typeof findPayment.companyId === "string" ||
        typeof findPayment.productId === "string"
      ) {
        return res.json({received: false});
      }

      if (findPayment?.productId?.price === undefined) {
        return res.json({received: false});
      }

      await stripe.invoiceItems.create({
        customer: !!findPayment?.companyId?.stripeCustomerId
          ? findPayment?.companyId?.stripeCustomerId
          : "",
        amount:
          typeof findPayment.couponId !== "string" &&
          !!findPayment?.couponId?.discount
            ? Number(
                (
                  findPayment?.productId?.price *
                  (100 - findPayment?.couponId?.discount)
                ).toFixed(2)
              )
            : findPayment?.productId?.price * 100,
        currency: "pln",
        description: !!findPayment?.productId?.name
          ? findPayment?.productId?.name
          : undefined,
        tax_rates: ["txr_1LQWqVEQE7ZEvtzfWhIf6j1f"],
      });

      const invoice = await stripe.invoices.create({
        customer: !!findPayment?.companyId?.stripeCustomerId
          ? findPayment?.companyId?.stripeCustomerId
          : undefined,
        collection_method: "send_invoice",
        days_until_due: 0,
      });

      const invoiceFinalize = await stripe.invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true,
        }
      );

      const invoicePay = await stripe.invoices.pay(invoiceFinalize.id, {
        paid_out_of_band: true,
      });

      const invoiceSend = await stripe.invoices.sendInvoice(invoicePay.id);

      if (!!invoiceSend.hosted_invoice_url) {
        const itemInvoice = {
          url: invoiceSend.hosted_invoice_url,
          date: new Date().toString(),
        };
        findPayment.stripeLinkInvoice.push(itemInvoice);
      }

      if (invoiceSend?.status === "paid") {
        const itemStatus = {
          value: invoiceSend.status,
          date: new Date().toString(),
        };
        findPayment.status.push(itemStatus);
      }

      findPayment.stripeCheckoutUrl = null;
      findPayment.stripeCheckoutId = null;

      await findPayment.save();

      const pointsCount: number = !!findPayment?.productId?.platformPointsCount
        ? findPayment?.productId?.platformPointsCount
        : 0;
      const smsCount: number = !!findPayment?.productId?.platformSMSCount
        ? findPayment?.productId?.platformSMSCount
        : 0;
      const premiumCount: number = !!findPayment?.productId
        ?.platformSubscriptionMonthsCount
        ? findPayment?.productId?.platformSubscriptionMonthsCount
        : 0;

      const bulkArrayToUpdate = [];

      bulkArrayToUpdate.push({
        updateOne: {
          filter: {
            _id: findPayment?.companyId?._id,
          },
          update: {
            $set: {status: "paid"},
          },
        },
      });

      if (!!smsCount) {
        bulkArrayToUpdate.push({
          updateOne: {
            filter: {
              _id: findPayment?.companyId?._id,
            },
            update: {
              $inc: {sms: smsCount},
            },
          },
        });
      }

      if (!!pointsCount) {
        bulkArrayToUpdate.push({
          updateOne: {
            filter: {
              _id: findPayment?.companyId?._id,
            },
            update: {
              $inc: {points: pointsCount},
            },
          },
        });
      }

      if (!!premiumCount) {
        bulkArrayToUpdate.push({
          updateOne: {
            filter: {
              _id: findPayment?.companyId?._id,
              subscriptiopnEndDate: {$exists: true},
            },
            update: [
              {
                $set: {
                  subscriptiopnEndDate: {
                    $add: [
                      "$subscriptiopnEndDate",
                      1000 * 60 * 60 * 24 * 30 * premiumCount,
                    ],
                  },
                },
              },
            ],
          },
        });
      }

      await Company.bulkWrite(bulkArrayToUpdate);
    } else {
      await Payment.updateOne(
        {
          _id: paymentId,
          companyId: companyId,
        },
        {
          $set: {
            stripeSubscriptionId: subscriptionId,
          },
        }
      );
    }

    return res.json({received: true});
  } catch (error) {
    console.log(error);
    return res.json({received: false});
  }
};
