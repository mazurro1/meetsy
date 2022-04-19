import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
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
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await confirmUserAccounEmailCode(
          session.user!.email,
          data.codeConfirmEmail,
          data.password,
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
      await sendAgainUserAccounEmailCode(
        session.user!.email,
        validContentLanguage,
        res
      );
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
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await changeUserAccounEmail(
          session.user!.email,
          data.password,
          data.newEmail,
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
    case "DELETE": {
      await deleteUserNoConfirmEmail(
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
