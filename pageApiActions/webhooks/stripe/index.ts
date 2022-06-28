import type {NextApiResponse} from "next";
import type {DataWebhookStripe} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {SendEmail, findValidUser, findValidCompany} from "@lib";

export const paymentFailure = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataWebhookStripe>,
  userEmail: string,
  customerStripeId: string
) => {
  try {
    const selectedUser = await findValidUser({
      userEmail: userEmail,
      select: "_id email",
    });

    const selectedCompany = await findValidCompany({
      companyId: null,
      select: "_id email companyDetails.name",
      query: {stripeCustomerId: customerStripeId},
    });

    if (!!!selectedUser || !!!selectedCompany) {
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

    return res.json({received: true});
  } catch (error) {
    return res.json({received: false});
  }
};
