import {buffer} from "micro";
import Cors from "micro-cors";
import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";
import {z} from "zod";
import type {LanguagesProps} from "@Texts";
import {
  subscriptionFailure,
  subscriptionSuccess,
  updatePayment,
} from "@/pageApiActions/webhooks/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let customerStripeId: string = "";
  let contentLanguage: LanguagesProps = "pl";

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      return res.json({received: true});
    }

    const session = event.data.object as any;

    if (!!session?.customer) {
      customerStripeId = session.customer as string;
    } else {
      return res.json({received: true});
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const DataProps = z.object({
          companyId: z.string(),
          paymentId: z.string(),
          subscriptionId: z.string().nullable(),
          paymentIntentId: z.string().nullable(),
          mode: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          companyId: session?.metadata?.companyId,
          paymentId: session?.metadata?.paymentId,
          subscriptionId: !!session?.subscription ? session.subscription : null,
          paymentIntentId: !!session?.payment_intent
            ? session.payment_intent
            : null,
          mode: session.mode,
        };
        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          return res.json({received: true});
        }

        if (session.payment_status === "paid") {
          return await updatePayment(
            contentLanguage,
            res,
            data.companyId,
            data.paymentId,
            data.subscriptionId,
            data.mode,
            data.paymentIntentId
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const session = event.data.object as any;
        if (!!session?.subscription && session.status === "paid") {
          const DataProps = z.object({
            subscriptionId: z.string(),
            customerStripeId: z.string(),
            invoiceUrl: z.string(),
          });

          type IDataProps = z.infer<typeof DataProps>;

          const data: IDataProps = {
            subscriptionId: session?.subscription,
            customerStripeId: customerStripeId,
            invoiceUrl: session?.hosted_invoice_url,
          };
          const resultData = DataProps.safeParse(data);
          if (!resultData.success) {
            return res.json({received: true});
          }

          return await subscriptionSuccess(
            contentLanguage,
            res,
            data.customerStripeId,
            data.subscriptionId,
            data.invoiceUrl
          );
        } else {
          return res.json({received: true});
        }
      }

      case "invoice.payment_failed": {
        const session = event.data.object as any;
        if (!!session?.subscription) {
          const DataProps = z.object({
            subscriptionId: z.string(),
            customerStripeId: z.string(),
          });

          type IDataProps = z.infer<typeof DataProps>;

          const data: IDataProps = {
            subscriptionId: session?.subscription,
            customerStripeId: customerStripeId,
          };
          const resultData = DataProps.safeParse(data);
          if (!resultData.success) {
            return res.json({received: true});
          }

          return await subscriptionFailure(
            contentLanguage,
            res,
            data.customerStripeId,
            data.subscriptionId
          );
        } else {
          return res.json({received: true});
        }
      }

      // case "checkout.session.async_payment_succeeded": {
      //   // dla płatności odroczonych w czasie
      //   const session = event.data.object;
      //   console.log("at checkout.session.async_payment_succeeded");

      //   // Fulfill the purchase...
      //   // fulfillOrder(session);

      //   break;
      // }

      // case "checkout.session.async_payment_failed": {
      //   // dla płatności odroczonych w czasie
      //   const session = event.data.object;
      //   console.log("at checkout.session.async_payment_failed");

      //   // Send an email to the customer asking them to retry their order
      //   // emailCustomerAboutFailedPayment(session);

      //   break;
      // }

      default: {
        return res.json({received: false});
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.json({received: true});
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default cors(handler as any);
