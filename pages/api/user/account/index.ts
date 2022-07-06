import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
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
      dataSession: dataSession,
    });
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      if (!!userEmail) {
        return await getUserAccount(userEmail, contentLanguage, res);
      } else {
        return res.status(401).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.notAuthentication,
          success: false,
          dataSession: dataSession,
        });
      }
    }
    case "DELETE": {
      if (!!userEmail) {
        if (req.body.password !== "undefined") {
          const DataProps = z.object({
            password: z.string().nonempty(),
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

          return await deleteUserAccount(
            userEmail,
            data.password,
            contentLanguage,
            res
          );
        } else {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await deleteRecoverUserAccount(data.email, contentLanguage, res);
      } else {
        return res.status(401).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.notAuthentication,
          success: false,
        });
      }
    }
    case "PATCH": {
      if (!!userEmail) {
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
            return res.status(422).json({
              message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
              success: false,
            });
          }

          return await updateUserAccount(
            userEmail,
            data.name,
            data.surname,
            data.password,
            contentLanguage,
            res
          );
        } else {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }
        return await updateRecoverUserAccount(
          data.email,
          data.codeRecoverAccount,
          data.newPassword,
          contentLanguage,
          res
        );
      } else {
        return res.status(401).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.notAuthentication,
          success: false,
        });
      }
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await recoverUserAccount(
          data.email,
          data.phone,
          data.regionalCode,
          contentLanguage,
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await resendRecoverUserAccount(data.email, contentLanguage, res);
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
    }
    case "PUT": {
      if (!!userEmail) {
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
            return res.status(422).json({
              message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
              success: false,
            });
          }

          return await updateConsentsUserAccount(
            userEmail,
            data.password,
            data.sendSmsAllServices,
            data.sendEmailsAllServices,
            data.sendEmailsMarketing,
            data.sendNotifications,
            contentLanguage,
            res
          );
        } else {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }
      } else {
        return res.status(401).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.notAuthentication,
          success: false,
        });
      }
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
