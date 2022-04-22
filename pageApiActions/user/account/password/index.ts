import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {
  hashPassword,
  verifyPassword,
  SendEmail,
  UserAlertsGenerator,
} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import Alert from "@/models/Alert/alert";

export const updateUserAccountPasswordFromSocial = (
  userEmail: string,
  userPassword: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    password: null,
    "userDetails.hasPassword": false,
  })
    .select("password userDetails")
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
    .then(async (userSaved) => {
      if (!!userSaved) {
        return res.status(200).json({
          success: true,
          data: {
            hasPassword: userSaved.userDetails.hasPassword,
          },
          message:
            AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmPassword,
        });
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    });
};

export const changeUserAccountPassword = (
  userEmail: string,
  oldPassword: string,
  newPassword: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    password: {$ne: null},
    "userDetails.hasPassword": true,
  })
    .select("password")
    .then(async (userData) => {
      if (!!userData && !!oldPassword && !!newPassword) {
        if (!!userData.password) {
          const isValidPassword = await verifyPassword(
            oldPassword,
            userData.password
          );
          if (isValidPassword) {
            const hashedPassword = await hashPassword(newPassword);
            if (hashedPassword !== userData.password) {
              userData.password = hashedPassword;
              return userData.save();
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        await UserAlertsGenerator({
          data: {
            color: "GREEN",
            type: "CHANGED_PASSWORD",
            userId: userSaved._id,
            active: true,
          },
          email: {
            title:
              AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmPassword,
            body: AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.confirmPasswordText,
          },
          webpush: {
            title:
              AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmPassword,
            body: AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.confirmPasswordText,
          },
          forceEmail: true,
          forceSocket: true,
          res: res,
        });

        return res.status(200).json({
          success: true,
          message:
            AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmPassword,
        });
      } else {
        return res.status(422).json({
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundOrPassword,
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    });
};
