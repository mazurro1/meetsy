import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {updateUserPush, deleteUserPush} from "@/pageApiActions/user/push";
import {AllTexts} from "@Texts";
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
    });
  }

  const {method} = req;
  switch (method) {
    case "POST": {
      if (!!userEmail) {
        const {endpoint, keys, expirationTime} = req.body;
        if (!!endpoint && !!keys) {
          const KeysProps = z.object({
            p256dh: z.string(),
            auth: z.string(),
          });

          const DataProps = z.object({
            endpoint: z.string(),
            keys: KeysProps,
            expirationTime: z.string().nullable(),
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

          await updateUserPush(
            userEmail,
            data.endpoint,
            data.keys,
            data.expirationTime,
            contentLanguage,
            res
          );
        } else {
          res.status(422).json({
            success: false,
          });
          return;
        }
        return;
      } else {
        res.status(401).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.notAuthentication,
          success: false,
        });
        return;
      }
    }
    case "DELETE": {
      await deleteUserPush(userEmail, contentLanguage, res);
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
