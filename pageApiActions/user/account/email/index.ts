import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {
  randomString,
  SendEmail,
  SendSMS,
  verifyPassword,
  UserAlertsGenerator,
} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import Alert from "@/models/Alert/alert";

export const sendAgainUserAccounEmailCode = (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
  })
    .select("email emailCode userDetails")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.emailCode = randomCodeEmail.toUpperCase();
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        if (!!!userSaved.userDetails.emailIsConfirmed) {
          await SendEmail({
            userEmail: userSaved.email,
            emailTitle:
              AllTexts[validContentLanguage]?.ConfirmEmail?.confirmEmailAdress,
            emailContent: `${AllTexts[validContentLanguage]?.ConfirmEmail.codeToConfirm} ${userSaved.emailCode}`,
          });
        } else {
          if (!!userSaved.userDetails.toConfirmEmail) {
            await SendEmail({
              userEmail: userSaved.userDetails.toConfirmEmail,
              emailTitle:
                AllTexts[validContentLanguage]?.ConfirmEmail
                  ?.confirmEmailAdress,
              emailContent: `${AllTexts[validContentLanguage]?.ConfirmEmail?.codeToConfirm} ${userSaved.emailCode}`,
            });
          }
        }

        res.status(200).json({
          success: true,
        });
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
    });
};

export const confirmUserAccounEmailCode = (
  userErmail: string,
  codeConfirmEmail: string,
  password: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    emailCode: codeConfirmEmail.toUpperCase(),
    password: {$ne: null},
  })
    .select("email emailCode userDetails phoneDetails password")
    .then(async (userData) => {
      if (!!userData) {
        let isValidPassword = true;
        if (!!password && !!userData.password) {
          isValidPassword = await verifyPassword(password, userData.password);
        }
        if (isValidPassword) {
          if (!!userData.userDetails.toConfirmEmail) {
            userData.email = userData.userDetails.toConfirmEmail;
            userData.userDetails.toConfirmEmail = null;
          } else {
            if (
              !!userData.phoneDetails.number &&
              !!userData.phoneDetails.regionalCode
            ) {
              const randomCodePhone = randomString(6);
              userData.phoneDetails.code = randomCodePhone.toUpperCase();
              userData.phoneDetails.dateSendAgainSMS = new Date(
                new Date().setHours(new Date().getHours() + 1)
              );
            }
          }
          userData.emailCode = null;
          userData.userDetails.emailIsConfirmed = true;
          return userData.save();
        } else {
          return null;
        }
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        await SendEmail({
          userEmail: userSaved.email,
          emailTitle:
            AllTexts[validContentLanguage]?.ConfirmEmail?.confirmedEmailAdress,
          emailContent:
            AllTexts[validContentLanguage]?.ConfirmEmail
              ?.confirmedTextEmailAdress,
        });

        if (userSaved.email === userErmail) {
          if (
            !!userSaved.phoneDetails.number &&
            !!userSaved.phoneDetails.regionalCode &&
            !!userSaved.phoneDetails.code
          ) {
            await SendSMS({
              phoneDetails: userSaved.phoneDetails,
              message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${userSaved.phoneDetails.code}`,
              forceSendUnconfirmedPhone: true,
            });
          }
        }
        if (!!password) {
          await UserAlertsGenerator({
            data: {
              color: "GREEN",
              type: "CHANGED_EMAIL",
              userId: userSaved._id,
              active: true,
            },
            email: null,
            webpush: {
              title:
                AllTexts[validContentLanguage]?.ConfirmEmail
                  ?.confirmedEmailAdress,
              body: AllTexts[validContentLanguage]?.ConfirmEmail
                ?.confirmedTextEmailAdress,
            },
            forceEmail: true,
            forceSocket: true,
            res: res,
          });

          res.status(200).json({
            success: true,
            data: {
              email: userSaved.email,
              emailConfirmed: true,
              dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
            },
            message:
              AllTexts[validContentLanguage]?.ConfirmEmail
                ?.confirmedTextEmailAdress,
          });
        } else {
          res.status(200).json({
            success: true,
            data: {
              email: userSaved.email,
              emailConfirmed: true,
              dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
            },
            message: AllTexts[validContentLanguage]?.ConfirmEmail?.invalidCode,
          });
        }
      } else {
        res.status(422).json({
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.notFoundCodeOrPassword,
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
    });
};

export const changeUserAccounEmail = (
  userErmail: string,
  password: string,
  newEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    password: {$ne: null},
    emailCode: null,
    "userDetails.emailIsConfirmed": true,
    "userDetails.toConfirmEmail": null,
  })
    .select("email userDetails password emailCode")
    .then(async (userData) => {
      if (!!userData) {
        if (!!userData.password) {
          const isValidPassword = await verifyPassword(
            password,
            userData.password
          );
          if (!!isValidPassword) {
            return User.findOne({
              email: newEmail,
            })
              .select("email")
              .then((searchedUser) => {
                if (!!searchedUser) {
                  return null;
                } else {
                  const randomCodeEmail = randomString(6);
                  userData.emailCode = randomCodeEmail.toUpperCase();
                  userData.userDetails.toConfirmEmail = newEmail;
                  return userData.save();
                }
              });
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
        if (!!userSaved.userDetails.toConfirmEmail) {
          await SendEmail({
            userEmail: userSaved.userDetails.toConfirmEmail,
            emailTitle:
              AllTexts[validContentLanguage]?.ConfirmEmail?.confirmEmailAdress,
            emailContent: `${AllTexts[validContentLanguage]?.ConfirmEmail?.codeToConfirm} ${userSaved.emailCode}`,
          });
        }

        res.status(200).json({
          success: true,
          data: {
            toConfirmEmail: userSaved.userDetails.toConfirmEmail,
          },
          message:
            AllTexts[validContentLanguage]?.ConfirmEmail?.smsConfirmEmailSend,
        });
      } else {
        res.status(422).json({
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.notFoundOrPasswordEmail,
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
    });
};

export const deleteUserNoConfirmEmail = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    emailCode: {$ne: null},
    "userDetails.toConfirmEmail": {$ne: null},
    "userDetails.emailIsConfirmed": true,
  })
    .select("email userDetails")
    .then(async (userData) => {
      if (!!userData) {
        userData.userDetails.toConfirmEmail = null;
        userData.emailCode = null;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        res.status(200).json({
          success: true,
          message: AllTexts[validContentLanguage]?.ConfirmEmail?.resetEmail,
        });
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidCode,
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
    });
};
