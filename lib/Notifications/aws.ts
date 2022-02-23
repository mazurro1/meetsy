import AWS from "aws-sdk";
import type {UserPhoneProps} from "@/models/User/user.model";
import type {NextApiRequest} from "next";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_APP,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_APP,
  region: process.env.AWS_REGION_APP,
  signatureVersion: "v4",
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

const sns = new AWS.SNS({});

interface UploadAWSImageProps {
  req: NextApiRequest;
  folderNameAWS: string;
}

export const UploadAWSImage = async ({
  req,
  folderNameAWS = "notDefined",
}: UploadAWSImageProps) => {
  try {
    const {type, name} = req.body;
    const fileParams = {
      Key: `${folderNameAWS}/${name}`,
      ContentType: type,
      Expires: 300,
      ACL: "public-read",
      Bucket: process.env.AWS_BUCKET,
    };
    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    return url;
  } catch (err) {
    console.log(err);
  }
};

interface SendSMSProps {
  phoneDetails: UserPhoneProps;
  message: string;
  forceSendUnconfirmedPhone?: boolean;
}

export const SendSMS = async ({
  phoneDetails,
  message = "",
  forceSendUnconfirmedPhone = false,
}: SendSMSProps) => {
  try {
    if (
      !!message &&
      !!phoneDetails.number &&
      !!phoneDetails.regionalCode &&
      (!!phoneDetails.isConfirmed || forceSendUnconfirmedPhone)
    ) {
      const params = {
        Message: message,
        PhoneNumber: `+${phoneDetails.regionalCode}${phoneDetails.number}`,
      };

      const resultSMS = await sns.publish(params).promise();
      if (!!resultSMS) {
        return !!resultSMS.MessageId;
      } else {
        return null;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
