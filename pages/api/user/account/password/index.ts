import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {
  updateUserAccountPasswordFromSocial,
  changeUserAccountPassword,
} from "pageApiActions/user/account/password";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

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
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "PATCH": {
      if (!!req.body.password) {
        const DataProps = z.object({
          password: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
            success: false,
          });
          return;
        }

        await updateUserAccountPasswordFromSocial(
          session.user!.email,
          data.password,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    case "PUT": {
      if (!!req.body.oldPassword && !!req.body.newPassword) {
        const DataProps = z.object({
          oldPassword: z.string(),
          newPassword: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
            success: false,
          });
          return;
        }
        await changeUserAccountPassword(
          session.user!.email,
          data.oldPassword,
          data.newPassword,
          validContentLanguage,
          res
        );
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
      return;
    }
  }
}
export default handler;
