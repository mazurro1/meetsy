import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  getUserAccount,
  deleteUserAccount,
  updateUserAccount,
  recoverUserAccount,
  resendRecoverUserAccount,
  deleteRecoverUserAccount,
  updateRecoverUserAccount,
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

  let isAuthUser: boolean = false;
  let userEmail: string = "";

  if (!!session) {
    if (!!session.user!.email) {
      isAuthUser = true;
      userEmail = session.user!.email;
    }
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      if (isAuthUser) {
        await getUserAccount(userEmail, validContentLanguage, res);
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
          success: false,
        });
      }
      return;
    }
    case "DELETE": {
      if (isAuthUser) {
        if (req.body.password !== "undefined") {
          await deleteUserAccount(
            userEmail,
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
      } else if (!!req.body.email && !!req.body.resetRecoverAccount) {
        await deleteRecoverUserAccount(
          req.body.email,
          validContentLanguage,
          res
        );
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
          success: false,
        });
      }
      return;
    }
    case "PATCH": {
      if (isAuthUser) {
        if (!!req.body.password && !!req.body.name && !!req.body.surname) {
          await updateUserAccount(
            userEmail,
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
      } else if (
        !!req.body.email &&
        !!req.body.codeRecoverAccount &&
        !!req.body.newPassword
      ) {
        await updateRecoverUserAccount(
          req.body.email,
          req.body.codeRecoverAccount,
          req.body.newPassword,
          validContentLanguage,
          res
        );
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage].ApiErrors.notAuthentication,
          success: false,
        });
      }
      return;
    }
    case "POST": {
      if (
        !!req.body.email &&
        !!req.body.phone &&
        !!req.body.regionalCode &&
        !!req.body.reciveAccount
      ) {
        await recoverUserAccount(
          req.body.email,
          req.body.phone,
          req.body.regionalCode,
          validContentLanguage,
          res
        );
      } else if (!!req.body.resendRecoverAccount && !!req.body.email) {
        await resendRecoverUserAccount(
          req.body.email,
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
