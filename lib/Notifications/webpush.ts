import webPush from "web-push";
import type {UserPushEndpointProps} from "@/models/User/user.model";

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    : "",
  !!process.env.WEB_PUSH_PRIVATE_KEY ? process.env.WEB_PUSH_PRIVATE_KEY : ""
);

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
