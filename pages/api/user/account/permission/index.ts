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
    case "PATCH": {
      if (!!req.body.phone && !!req.body.phoneRegionalCode) {
        const DataProps = z.object({
          phone: z.number(),
          phoneRegionalCode: z.number(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await updateUserAccounPhone(
          session.user!.email,
          data.phone,
          data.phoneRegionalCode,
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
    case "POST": {
      if (!!req.body.codeConfirmPhone) {
        const DataProps = z.object({
          codeConfirmPhone: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await confirmUserAccounPhoneCode(
          session.user!.email,
          data.codeConfirmPhone,
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
    case "PUT": {
      if (
        !!req.body.password &&
        !!req.body.newPhone &&
        !!req.body.newRegionalCode
      ) {
        const DataProps = z.object({
          password: z.string(),
          newPhone: z.number(),
          newRegionalCode: z.number(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await changeUserAccounPhone(
          session.user!.email,
          data.password,
          data.newPhone,
          data.newRegionalCode,
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
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }
  }
}
export default handler;
