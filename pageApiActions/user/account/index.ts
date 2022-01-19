import User from "@/models/user";
import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";

export const getUserAccount = (
  userErmail: string,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
  })
    .select("email language name surname avatarUrl isNewFromSocial")
    .then((userData) => {
      if (!!userData) {
        res.status(200).json({
          data: userData,
          success: true,
        });
      } else {
        res.status(422).json({
          message: {
            pl: "Nie znaleziono konta",
            en: "Not found account",
          },
          success: false,
        });
      }
    });
};
