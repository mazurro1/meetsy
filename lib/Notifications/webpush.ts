import webPush from "web-push";
import type {UserPushEndpointProps} from "@/models/User/user.model";

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    : "",
  !!process.env.WEB_PUSH_PRIVATE_KEY ? process.env.WEB_PUSH_PRIVATE_KEY : ""
);

export interface SendWebPushProps {
  pushEndpoint?: UserPushEndpointProps;
  title: string;
  body: string;
}

export const SendWebPush = async ({
  pushEndpoint,
  title,
  body,
}: SendWebPushProps) => {
  try {
    if (!!pushEndpoint) {
      if (
        !!pushEndpoint.endpoint &&
        !!pushEndpoint.keys.auth &&
        !!pushEndpoint.keys.p256dh &&
        !!title &&
        !!body
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
              body: body,
            })
          )
          .catch((err) => {
            console.error(err);
          });

        return !!resultWebpush;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};
