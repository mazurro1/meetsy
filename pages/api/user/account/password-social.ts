import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import type { DataProps } from "@/utils/type";
import { updateUserAccountPasswordFromSocial } from "pageApiActions/user/account/password-social";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({
      message: {
        pl: "Brak autoryzacji!",
        en: "Not authenticated!",
      },
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: {
        pl: "Brak autoryzacji!",
        en: "Not authenticated!",
      },
      success: false,
    });
    return;
  }

  const { method } = req;
  switch (method) {
    case "PATCH": {
      if (!!req.body.password) {
        await updateUserAccountPasswordFromSocial(
          session.user!.email,
          req.body.password,
          res
        );
      } else {
        res.status(422).json({
          message: {
            pl: "Nieprawidłowe dane wejściowe!",
            en: "Invalid input!",
          },
          success: false,
        });
      }
      return;
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
