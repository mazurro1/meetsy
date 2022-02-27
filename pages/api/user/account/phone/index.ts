import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  updateUserAccounPhone,
  sendAgainUserAccounPhoneCode,
  confirmUserAccounPhoneCode,
  deleteUserNoConfirmPhone,
  changeUserAccounPhone,
} from "pageApiActions/user/account/phone";

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
      if (!!req.body.phone && !!req.body.phoneRegionalCode) {
        await updateUserAccounPhone(
          session.user!.email,
          req.body.phone,
          req.body.phoneRegionalCode,
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
    case "POST": {
      if (!!req.body.codeConfirmPhone) {
        await confirmUserAccounPhoneCode(
          session.user!.email,
          req.body.codeConfirmPhone,
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
    case "PUT": {
      if (
        !!req.body.password &&
        !!req.body.newPhone &&
        !!req.body.newRegionalCode
      ) {
        await changeUserAccounPhone(
          session.user!.email,
          req.body.password,
          req.body.newPhone,
          req.body.newRegionalCode,
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
      await sendAgainUserAccounPhoneCode(
        session.user!.email,
        validContentLanguage,
        res
      );
      return;
    }
    case "DELETE": {
      await deleteUserNoConfirmPhone(
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
