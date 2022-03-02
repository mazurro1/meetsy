import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  getUserAccount,
  deleteUserAccount,
  updateUserAccount,
} from "pageApiActions/user/account";
import type {LanguagesProps} from "@Texts";

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
  }
  if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      await getUserAccount(session.user!.email, validContentLanguage, res);
      return;
    }
    case "DELETE": {
      if (req.body.password !== "undefined") {
        await deleteUserAccount(
          session.user!.email,
          req.body.password,
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
    case "PATCH": {
      if (!!req.body.password && !!req.body.name && !!req.body.surname) {
        await updateUserAccount(
          session.user!.email,
          req.body.name,
          req.body.surname,
          req.body.password,
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
    default: {
      res.status(501).json({
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
