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
  updateConsentsUserAccount,
} from "pageApiActions/user/account";
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
          message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
          success: false,
        });
      }
      return;
    }
    case "DELETE": {
      if (isAuthUser) {
        if (req.body.password !== "undefined") {
          const DataProps = z.object({
            password: z.string().nonempty(),
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

          await deleteUserAccount(
            userEmail,
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
      } else if (!!req.body.email && !!req.body.resetRecoverAccount) {
        const DataProps = z.object({
          email: z.string().email().nonempty(),
          resetRecoverAccount: z.boolean(),
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

        await deleteRecoverUserAccount(data.email, validContentLanguage, res);
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
          success: false,
        });
      }
      return;
    }
    case "PATCH": {
      if (isAuthUser) {
        if (!!req.body.password && !!req.body.name && !!req.body.surname) {
          const DataProps = z.object({
            password: z.string(),
            name: z.string(),
            surname: z.string(),
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

          await updateUserAccount(
            userEmail,
            data.name,
            data.surname,
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
      } else if (
        !!req.body.email &&
        !!req.body.codeRecoverAccount &&
        !!req.body.newPassword
      ) {
        const DataProps = z.object({
          email: z.string().email().nonempty(),
          codeRecoverAccount: z.string(),
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
        await updateRecoverUserAccount(
          data.email,
          data.codeRecoverAccount,
          data.newPassword,
          validContentLanguage,
          res
        );
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
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
        const DataProps = z.object({
          email: z.string().email().nonempty(),
          phone: z.number(),
          regionalCode: z.number(),
          reciveAccount: z.boolean(),
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

        await recoverUserAccount(
          data.email,
          data.phone,
          data.regionalCode,
          validContentLanguage,
          res
        );
      } else if (!!req.body.resendRecoverAccount && !!req.body.email) {
        const DataProps = z.object({
          email: z.string().email().nonempty(),
          resendRecoverAccount: z.boolean(),
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

        await resendRecoverUserAccount(data.email, validContentLanguage, res);
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    case "PUT": {
      if (isAuthUser) {
        if (
          !!req.body.password &&
          req.body.sendSmsAllServices !== "undefined" &&
          req.body.sendEmailsAllServices !== "undefined" &&
          req.body.sendEmailsMarketing !== "undefined" &&
          req.body.sendNotifications !== "undefined"
        ) {
          const DataProps = z.object({
            password: z.string(),
            sendSmsAllServices: z.boolean(),
            sendEmailsAllServices: z.boolean(),
            sendEmailsMarketing: z.boolean(),
            sendNotifications: z.boolean(),
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

          await updateConsentsUserAccount(
            userEmail,
            data.password,
            data.sendSmsAllServices,
            data.sendEmailsAllServices,
            data.sendEmailsMarketing,
            data.sendNotifications,
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
      } else {
        res.status(401).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
          success: false,
        });
      }
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
