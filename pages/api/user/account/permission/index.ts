import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
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
  let userEmail: string = "";
  let contentLanguage: LanguagesProps = "pl";
  const dataSession = await checkAuthUserSessionAndReturnData(req);
  if (!!dataSession) {
    userEmail = dataSession.userEmail;
    contentLanguage = dataSession.contentLanguage;
  } else {
    return res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
    });
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await updateUserAccounPhone(
          userEmail,
          data.phone,
          data.phoneRegionalCode,
          contentLanguage,
          res
        );
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await confirmUserAccounPhoneCode(
          userEmail,
          data.codeConfirmPhone,
          contentLanguage,
          res
        );
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await changeUserAccounPhone(
          userEmail,
          data.password,
          data.newPhone,
          data.newRegionalCode,
          contentLanguage,
          res
        );
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
    }
    case "GET": {
      return await sendAgainUserAccounPhoneCode(
        userEmail,
        contentLanguage,
        res
      );
    }
    case "DELETE": {
      return await deleteUserNoConfirmPhone(userEmail, contentLanguage, res);
    }
    default: {
      return res.status(501).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
