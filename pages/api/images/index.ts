import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {UploadAWSImage} from "@lib";
import {z} from "zod";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  let companyId: string | null = "";
  let userEmail: string = "";
  let contentLanguage: LanguagesProps = "pl";
  const dataSession = await checkAuthUserSessionAndReturnData(req);
  if (!!dataSession) {
    companyId = dataSession.companyId;
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
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        const resultUploadFile = await UploadAWSImage({
          req: req,
          folderNameAWS:
            data.type === "COMPANY" ? "companys/images" : "users/avatars",
        });

        if (!!resultUploadFile) {
          return res.status(200).json({
            success: true,
            data: {
              url: resultUploadFile,
            },
          });
        } else {
          return res.status(401).json({
            success: false,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
    }
    default: {
      return res.status(400).json({
        success: false,
      });
    }
  }
}
export default handler;
