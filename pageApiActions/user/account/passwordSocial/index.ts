import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {hashPassword} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const updateUserAccountPasswordFromSocial = (
  userErmail: string,
  userPassword: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    password: null,
  })
    .select("password userDetails.hasPassword")
    .then(async (userData) => {
      if (!!userData && !!userPassword) {
        const hashedPassword = await hashPassword(userPassword);
        userData.password = hashedPassword;
        userData.userDetails.hasPassword = true;
        return userData.save();
      } else {
        return null;
      }
    })
    .then((userSaved) => {
      if (!!userSaved) {
        res.status(200).json({
          success: true,
          data: {
            hasPassword: userSaved.userDetails.hasPassword,
          },
        });
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage].ApiErrors.notFoundAccount,
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: err,
      });
    });
};
