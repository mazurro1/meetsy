import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {hashPassword, randomString, SendEmail} from "@lib";
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
    .select("password userDetails")
    .then(async (userData) => {
      if (!!userData && !!userPassword) {
        const hashedPassword = await hashPassword(userPassword);
        // const randomCodeEmail = randomString(6);
        // userData.emailCode = randomCodeEmail;
        userData.password = hashedPassword;
        userData.userDetails.hasPassword = true;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        const userLanguage: LanguagesProps = userSaved.userDetails.language;
        // if (!!!userSaved.userDetails.emailIsConfirmed) {
        //   await SendEmail({
        //     userEmail: userSaved.email,
        //     emailTitle: AllTexts[userLanguage].ConfirmEmail.confirmEmailAdress,
        //     emailContent: `${AllTexts[userLanguage].ConfirmEmail.codeToConfirm} ${userSaved.emailCode}`,
        //   });
        // }

        res.status(200).json({
          success: true,
          data: {
            hasPassword: userSaved.userDetails.hasPassword,
          },
          message: AllTexts[userLanguage]?.ConfirmEmail?.confirmPassword,
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
