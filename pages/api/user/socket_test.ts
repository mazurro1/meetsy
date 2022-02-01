import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import type { DataProps } from "@/utils/type";
import User from "@/models/user";
import webPush from "web-push";

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
    : "",
  !!process.env.WEB_PUSH_PRIVATE_KEY ? process.env.WEB_PUSH_PRIVATE_KEY : ""
);

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({ req });
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

  const { method } = req;
  switch (method) {
    case "GET": {
      const selectedUser = await User.findOne({
        email: session.user!.email,
      }).select("_id email pushEndpoint");

      if (!!selectedUser) {
        const socketToEmit = res.socket as any;
        socketToEmit.server?.io?.emit?.(`userId?${selectedUser._id}`, {
          action: "update-alerts-from-backend",
          data: {
            message: "xd",
          },
        });

        if (
          !!selectedUser.pushEndpoint.endpoint &&
          !!selectedUser.pushEndpoint.keys.auth &&
          !!selectedUser.pushEndpoint.keys.p256dh
        ) {
          await webPush
            .sendNotification(
              {
                endpoint: selectedUser.pushEndpoint.endpoint,
                keys: {
                  auth: selectedUser.pushEndpoint.keys.auth,
                  p256dh: selectedUser.pushEndpoint.keys.p256dh,
                },
              },
              JSON.stringify({
                title: "Hello Web Push",
                message: "Your web push notification is here!",
              })
            )
            .catch((err) => {
              if ("statusCode" in err) {
                res.writeHead(err.statusCode, err.headers).end(err.body);
              } else {
                console.error(err);
                res.statusCode = 500;
                res.end();
              }
            });
        }

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
      res.status(400).json({
        success: false,
      });
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
