import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";

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
