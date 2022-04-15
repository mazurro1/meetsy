import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {getEditCompany} from "pageApiActions/company/edit";
import type {LanguagesProps} from "@Texts";

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

  const contentUserEmail: null | string =
    typeof req.headers["content-useremail"] === "string"
      ? !!req.headers["content-useremail"]
        ? req.headers["content-useremail"]
        : null
      : null;

  const validContentLanguage: LanguagesProps = !!contentLanguage
    ? contentLanguage === "pl" || contentLanguage === "en"
      ? contentLanguage
      : "pl"
    : "pl";

  if (!session && !contentUserEmail) {
    res.status(401).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  } else if (!session?.user!.email && !contentUserEmail) {
    res.status(401).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      if (!!contentCompanyId && !!contentUserEmail) {
        await getEditCompany(
          contentUserEmail,
          contentCompanyId,
          validContentLanguage,
          res
        );
        return;
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    default: {
      res.status(501).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
