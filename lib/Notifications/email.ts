import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_MAIL_HOST,
  port: Number(process.env.NODEMAILER_MAIL_PORT),
  secure: true,
  auth: {
    type: "OAUTH2",
    user: process.env.NODEMAILER_MAIL_ADRESS,
    clientId: process.env.NODEMAILER_CLIENT_ID,
    clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
    refreshToken: process.env.NODEMAILER_REFRESH_TOKEN,
    accessToken: process.env.NODEMAILER_ACCESS_TOKEN,
  },
});

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
