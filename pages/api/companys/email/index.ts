import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  sendAgainEmailVerification,
  confirmCompanyAccounEmailCode,
} from "pageApiActions/company/email";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({req});
  const contentLanguage: LanguagesProps | undefined | string =
    req.headers["content-language"];
  const contentCompanyId: null | string =
    typeof req.headers["content-companyid"] === "string"
      ? !!req.headers["content-companyid"]
        ? req.headers["content-companyid"]
        : null
      : null;

  const validContentLanguage: LanguagesProps = !!contentLanguage
    ? contentLanguage === "pl" || contentLanguage === "en"
      ? contentLanguage
      : "pl"
    : "pl";

  if (!session) {
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      if (!!contentCompanyId) {
        await sendAgainEmailVerification(
          session.user!.email,
          contentCompanyId,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    case "PATCH": {
      if (!!req.body.codeConfirmEmail && contentCompanyId) {
        const DataProps = z.object({
          codeConfirmEmail: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          codeConfirmEmail: req.body.codeConfirmEmail,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await confirmCompanyAccounEmailCode(
          session.user!.email,
          contentCompanyId,
          data.codeConfirmEmail,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    default: {
      res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
