import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import User from "@/models/User/user";
import {
  SendEmail,
  SendSMS,
  SendWebPush,
  SendSocketIO,
  GetGUSCompanyInfo,
  UploadAWSImage,
} from "@lib";

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
    case "GET": {
      const selectedUser = await User.findOne({
        email: session.user!.email,
      }).select("_id email pushEndpoint phoneDetails");

      if (!!selectedUser) {
        // const resultEmail = await SendEmail({
        //   userEmail: selectedUser.email,
        //   emailTitle: "Tytuł testowy",
        //   emailContent: "Email testowy",
        // });
        // console.log("resultEmail", resultEmail);

        // const SMSResult = await SendSMS({
        //   phoneDetails: selectedUser.phoneDetails,
        //   message: "test sms" + new Date(),
        // });
        // console.log(SMSResult);

        // const resultGUS = await GetGUSCompanyInfo({ companyNip: 7962994651 });
        // console.log(resultGUS);

        const resultEmit = await SendSocketIO({
          userId: selectedUser._id.toString(),
          res: res,
          action: "action-to-test",
          data: {empty: true},
        });
        console.log("resultEmit", resultEmit);

        const resultWebPush = await SendWebPush({
          pushEndpoint: selectedUser.pushEndpoint,
          title: "title web push",
          data: {
            message: "test",
          },
        });
        console.log("resultWebPush", resultWebPush);

        res.status(201).json({
          success: true,
        });
        return;
      } else {
        res.status(401).json({
          success: false,
        });
        return;
      }
    }
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
