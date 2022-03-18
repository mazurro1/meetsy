import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";

export interface SendSocketIOProps {
  res: NextApiResponse<DataProps>;
  userId: string;
  action: string | null;
  data: any;
}

export const SendSocketIO = async ({
  res,
  userId,
  action = null,
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
