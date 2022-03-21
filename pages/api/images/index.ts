import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {UploadAWSImage} from "@lib";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({req});
  if (!session) {
    res.status(401).json({
      success: false,
    });
    return;
  }
  if (!session.user!.email) {
    res.status(401).json({
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "POST": {
      const resultUploadFile = await UploadAWSImage({
        req: req,
        folderNameAWS: "companys/images",
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
