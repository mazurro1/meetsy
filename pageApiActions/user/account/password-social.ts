import User from "@/models/user";
import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";
import { hashPassword } from "@lib";

export const updateUserAccountPasswordFromSocial = (
  userErmail: string,
  userPassword: string,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    password: null,
  })
    .select("password userDetails.isNewFromSocial")
    .then(async (userData) => {
      if (!!userData && !!userPassword) {
        const hashedPassword = await hashPassword(userPassword);
        userData.password = hashedPassword;
        userData.userDetails.isNewFromSocial = false;
        return userData.save();
      } else {
        res.status(422).json({
          message: {
            pl: "Błąd podczas aktualziacji konta",
            en: "Error updating account",
          },
          success: false,
        });
      }
    })
    .then(() => {
      res.status(200).json({
        success: true,
        data: {
          isNewFromSocial: false,
        },
      });
    });
};
