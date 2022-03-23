import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {UploadAWSImage} from "@lib";
import {z} from "zod";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

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
    case "POST": {
      if (!!req.body.image && !!req.body.type) {
        const TYPE_FOLDER_AWS = ["COMPANY", "USER"] as const;

        const EnumTypeFolderAWS = z.enum(TYPE_FOLDER_AWS);

        const DataImage = z.object({
          name: z.string(),
          type: z.string(),
        });

        const DataProps = z.object({
          image: DataImage,
          type: EnumTypeFolderAWS,
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          image: {
            name: req.body.image?.name,
            type: req.body.image?.type,
          },
          type: req.body.type,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
            success: false,
          });
          return;
        }

        const resultUploadFile = await UploadAWSImage({
          req: req,
          folderNameAWS:
            data.type === "COMPANY" ? "companys/images" : "users/avatars",
        });

        if (!!resultUploadFile) {
          res.status(200).json({
            success: true,
            data: {
              url: resultUploadFile,
            },
          });
        } else {
          res.status(401).json({
            success: false,
          });
        }
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    default: {
      res.status(400).json({
        success: false,
      });
      return;
    }
  }
}
export default handler;