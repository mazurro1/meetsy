import {SendWebPush, SendSocketIO, SendEmail} from "@lib";
import User from "@/models/User/user";
import {EnumUserConsents} from "@/models/User/user.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import Alert from "@/models/Alert/alert";
import type {AlertProps} from "@/models/Alert/alert.model";

interface WebPushProps {
  title: string;
  body: string;
}

interface EmailProps {
  title: string;
  body: string;
}

interface UserAlertsGeneratorProps {
  data: AlertProps;
  res: NextApiResponse<DataProps>;
  webpush?: WebPushProps | null;
  email?: EmailProps | null;
  forceSocket?: boolean;
  forceEmail?: boolean;
}

export const UserAlertsGenerator = async ({
  data,
  res,
  webpush = null,
  email = null,
  forceSocket = false,
  forceEmail = false,
}: UserAlertsGeneratorProps) => {
  if (!!!data || !!!res) {
    return null;
  }

  if (!!!data.userId) {
    return null;
  }

  const searchedUser = await User.findOne({
    _id: data.userId,
  }).select("pushEndpoint consents email userDetails.emailIsConfirmed");
  if (!!searchedUser) {
    if (!!data) {
      const newAlert = new Alert({
        userId: data.userId,
        companyId: !!data.companyId ? data.companyId : null,
        active: data.active,
        color: data.color,
        type: data.type,
      });

      await newAlert.save();

      const alertSaved = await newAlert.populate(
        "companyId",
        "companyDetails.name"
      );

      const userHasConsentsNotifications = searchedUser.consents.some(
        (item) => item === EnumUserConsents.sendNotifications
      );

      if (userHasConsentsNotifications && webpush) {
        await SendWebPush({
          pushEndpoint: searchedUser.pushEndpoint,
          title: webpush.title,
          body: webpush.body,
        });
      }

      if (userHasConsentsNotifications || forceSocket) {
        await SendSocketIO({
          res: res,
          userId: data.userId.toString(),
          action: "user-alerts",
          data: alertSaved,
        });
      }

      if (
        (userHasConsentsNotifications || forceEmail) &&
        !!email &&
        searchedUser.userDetails.emailIsConfirmed
      ) {
        await SendEmail({
          userEmail: searchedUser.email,
          emailTitle: email.title,
          emailContent: email.body,
        });
      }

      return alertSaved;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
