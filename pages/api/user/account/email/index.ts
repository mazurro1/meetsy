import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  sendAgainUserAccounEmailCode,
  confirmUserAccounEmailCode,
} from "pageApiActions/user/account/email";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({req});
  const contentLanguage: LanguagesProps | undefined | string =
    req.headers["content-language"];
  const validContentLanguage: LanguagesProps = !!contentLanguage
    ? contentLanguage === "pl" || contentLanguage === "en"
      ? contentLanguage
      : "pl"
    : "pl";

  if (!session) {
    res.status(401).json({
      message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "PATCH": {
      if (!!req.body.codeConfirmEmail) {
        await confirmUserAccounEmailCode(
          session.user!.email,
          req.body.codeConfirmEmail,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage].ApiErrors.invalidInputs,
          success: false,
        });
      }
      return;
    }
    case "GET": {
      await sendAgainUserAccounEmailCode(
        session.user!.email,
        validContentLanguage,
        res
      );
      return;
    }
    default: {
      res.status(501).json({
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
        success: false,
      });
      return;
    }
  }
}
export default handler;
