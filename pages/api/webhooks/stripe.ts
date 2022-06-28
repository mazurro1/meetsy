import {buffer} from "micro";
import Cors from "micro-cors";
import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";
import type {DataProps} from "@/utils/type";
import type {LanguagesProps} from "@Texts";
import {AllTexts} from "@Texts";
import {paymentFailure} from "@/pageApiActions/webhooks/stripe";

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
  let userEmail: string = "";
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
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (!!paymentIntent?.receipt_email && !!paymentIntent?.customer) {
      userEmail = paymentIntent.receipt_email;
      customerStripeId = paymentIntent.customer as string;
    } else {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
        success: false,
      });
    }

    switch (event.type) {
      case "payment_intent.created": {
        console.log(paymentIntent);
        // tworzenie subskrypcji
        console.log(`PaymentIntent created: ${paymentIntent.status}`);

        break;
      }

      case "payment_intent.succeeded": {
        // płatność potwierdzona
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);

        break;
      }

      case "payment_intent.payment_failed": {
        return await paymentFailure(
          contentLanguage,
          res,
          userEmail,
          customerStripeId
        );
      }

      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`💵 Charge id: ${charge.id}`);
        break;
      }

      default: {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
      }
    }

    /*
    if (hasProductOnlyToPay) {
      // dodawanie produktów do faktury
      await stripe.invoiceItems.create({
        customer: findCompany.stripeCustomerId,
        amount: 1000,
        currency: "pln",
        description: "Produkt x",
      });

      // wystawianie faktury
      const invoice = await stripe.invoices.create({
        customer: findCompany.stripeCustomerId,
        collection_method: "send_invoice",
        days_until_due: 0,
      });

      // finalizuj fakture
      const invoiceFinalize = await stripe.invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true,
        }
      );
      // console.log(invoiceFinalize);

      const invoicePay = await stripe.invoices.pay(invoiceFinalize.id, {
        paid_out_of_band: true,
      });

      // // wyślij fakture
      // const invoiceSend = await stripe.invoices.sendInvoice(invoicePay.id);
      // console.log(invoiceSend);
    }
*/
    // Return a response to acknowledge receipt of the event.
    res.json({received: true});
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default cors(handler as any);
