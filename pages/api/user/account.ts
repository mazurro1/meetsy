import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import type { DataProps } from "@/utils/type";
import { getUserAccount } from "pageApiActions/user/account";

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
  }
  if (!session.user!.email) {
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
    case "GET": {
      await getUserAccount(session.user!.email, res);
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
