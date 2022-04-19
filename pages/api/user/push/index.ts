import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {updateUserPush, deleteUserPush} from "@/pageApiActions/user/push";
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

  let userLogin: boolean = true;
  if (!session) {
    userLogin = false;

    return;
  }
  if (!session.user!.email) {
    userLogin = false;
    return;
  }

  const {method} = req;
  switch (method) {
    case "POST": {
      if (userLogin) {
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
              message:
                AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
              success: false,
            });
            return;
          }

          await updateUserPush(
            session.user!.email,
            data.endpoint,
            data.keys,
            data.expirationTime,
            validContentLanguage,
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
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
          success: false,
        });
        return;
      }
    }
    case "DELETE": {
      await deleteUserPush(session.user!.email, validContentLanguage, res);
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
