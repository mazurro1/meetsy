import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  sendAgainUserAccounEmailCode,
  confirmUserAccounEmailCode,
  changeUserAccounEmail,
  deleteUserNoConfirmEmail,
} from "pageApiActions/user/account/email";
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
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "PATCH": {
      if (!!req.body.codeConfirmEmail) {
        const DataProps = z.object({
          codeConfirmEmail: z.string(),
          password: z.string().nullable(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          codeConfirmEmail: req.body.codeConfirmEmail,
          password: !!req.body.password ? req.body.password : null,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await confirmUserAccounEmailCode(
          userEmail,
          data.codeConfirmEmail,
          data.password,
          contentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    case "GET": {
      await sendAgainUserAccounEmailCode(userEmail, contentLanguage, res);
      return;
    }
    case "PUT": {
      if (!!req.body.password && !!req.body.newEmail) {
        const DataProps = z.object({
          newEmail: z.string().email().nonempty(),
          password: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await changeUserAccounEmail(
          userEmail,
          data.password,
          data.newEmail,
          contentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    case "DELETE": {
      await deleteUserNoConfirmEmail(userEmail, contentLanguage, res);
      return;
    }
    default: {
      res.status(501).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }
  }
}
export default handler;
