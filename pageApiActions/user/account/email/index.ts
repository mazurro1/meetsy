import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {randomString, SendEmail} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const sendAgainUserAccounEmailCode = (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    "userDetails.emailIsConfirmed": false,
  })
    .select("email emailCode userDetails.language userDetails.emailIsConfirmed")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.emailCode = randomCodeEmail;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        if (!!userSaved) {
          if (!!!userSaved.userDetails.emailIsConfirmed) {
            const userLanguage: LanguagesProps = userSaved.userDetails.language;

            await SendEmail({
              userEmail: userSaved.email,
              emailTitle:
                AllTexts[userLanguage].ConfirmEmail.confirmEmailAdress,
              emailContent: `${AllTexts[userLanguage].ConfirmEmail.codeToConfirm} ${userSaved.emailCode}`,
            });
          }
        }

        res.status(200).json({
          success: true,
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

export const confirmUserAccounEmailCode = (
  userErmail: string,
  codeConfirmEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    "userDetails.emailIsConfirmed": false,
    emailCode: codeConfirmEmail,
  })
    .select("email emailCode userDetails.language userDetails.emailIsConfirmed")
    .then(async (userData) => {
      if (!!userData) {
        userData.emailCode = null;
        userData.userDetails.emailIsConfirmed = true;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        const userLanguage: LanguagesProps = userSaved.userDetails.language;
        await SendEmail({
          userEmail: userSaved.email,
          emailTitle: AllTexts[userLanguage].ConfirmEmail.confirmedEmailAdress,
          emailContent:
            AllTexts[userLanguage].ConfirmEmail.confirmedTextEmailAdress,
        });

        res.status(200).json({
          success: true,
          data: {
            emailConfirmed: true,
          },
        });
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage].ApiErrors.invalidCode,
          success: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
      });
    });
};
