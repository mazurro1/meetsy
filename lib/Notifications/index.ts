import nodemailer from "nodemailer";
import AWS from "aws-sdk";
import type { UserPhoneProps, UserPushEndpointProps } from "@/models/user";
import webPush from "web-push";
import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_MAIL_HOST,
  port: Number(process.env.NODEMAILER_MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.NODEMAILER_MAIL_ADRESS,
    pass: process.env.NODEMAILER_MAIL_PASSWORD,
  },
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_APP,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_APP,
  region: process.env.AWS_REGION_APP,
});

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    : "",
  !!process.env.WEB_PUSH_PRIVATE_KEY ? process.env.WEB_PUSH_PRIVATE_KEY : ""
);

// const s3Bucket = new AWS.S3({
//   params: {
//     Bucket: process.env.AWS_BUCKET,
//   },
// });

const sns = new AWS.SNS({});

interface GenerateEmailProps {
  emailContent: string;
  emailTitle: string;
  userEmail: string;
}

export const SendEmail = async ({
  emailContent = "",
  userEmail = "",
  emailTitle = "",
}: GenerateEmailProps) => {
  try {
    if (!!emailContent && !!userEmail && !!emailTitle) {
      const emailStatus = await transporter.sendMail({
        from: `${process.env.NODEMAILER_MAIL_ADRESS}`,
        to: userEmail,
        subject: emailTitle,
        text: emailContent,
      });
      return !!emailStatus.messageId;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

interface SendSMSProps {
  phoneDetails: UserPhoneProps;
  message: string;
}

export const SendSMS = async ({ phoneDetails, message = "" }: SendSMSProps) => {
  try {
    if (
      !!message &&
      !!phoneDetails.number &&
      !!phoneDetails.regionalCode &&
      !!phoneDetails.isConfirmed
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

interface SendWebPushProps {
  pushEndpoint: UserPushEndpointProps;
  title: string;
  data: any;
}

export const SendWebPush = async ({
  pushEndpoint,
  title,
  data,
}: SendWebPushProps) => {
  try {
    if (
      !!pushEndpoint.endpoint &&
      !!pushEndpoint.keys.auth &&
      !!pushEndpoint.keys.p256dh &&
      !!title &&
      !!data
    ) {
      const resultWebpush = await webPush
        .sendNotification(
          {
            endpoint: pushEndpoint.endpoint,
            keys: {
              auth: pushEndpoint.keys.auth,
              p256dh: pushEndpoint.keys.p256dh,
            },
          },
          JSON.stringify({
            title: title,
            data: data,
          })
        )
        .catch((err) => {
          console.error(err);
        });

      return !!resultWebpush;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

interface SendSocketIOProps {
  res: NextApiResponse<DataProps>;
  userId: string;
  action: string;
  data: any;
}

export const SendSocketIO = async ({
  res,
  userId,
  action = "default-action",
  data,
}: SendSocketIOProps) => {
  try {
    if (!!res) {
      const socketToEmit = res.socket as any;
      if (!!socketToEmit && !!userId && !!data && !!action) {
        const resultEmit = await socketToEmit.server?.io?.emit?.(
          `userId?${userId}`,
          {
            action: action,
            data: data,
          }
        );
        return resultEmit;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
