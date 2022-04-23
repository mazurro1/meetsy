import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import User from "@/models/User/user";
import {SendWebPush, SendSocketIO, UploadAWSImage} from "@lib";
import type {LanguagesProps} from "@Texts";
import {AllTexts} from "@Texts";

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
    case "GET": {
      const selectedUser = await User.findOne({
        email: userEmail,
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
          action: "test",
          data: {empty: true},
        });
        console.log("resultEmit", resultEmit);

        const resultWebPush = await SendWebPush({
          pushEndpoint: selectedUser.pushEndpoint,
          title: "title web push",
          body: "test",
        });
        console.log("resultWebPush", resultWebPush);

        return res.status(201).json({
          success: true,
        });
      } else {
        return res.status(401).json({
          success: false,
        });
      }
    }
    case "POST": {
      const resultUploadFile = await UploadAWSImage({
        req: req,
        folderNameAWS: "companys/images",
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
    }
    default: {
      return res.status(400).json({
        success: false,
      });
    }
  }
}
export default handler;
