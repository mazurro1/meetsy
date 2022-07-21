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

export const sendAgainUserAccounEmailCode = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    banned: false,
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
              AllTexts?.ConfirmEmail?.[validContentLanguage]
                ?.confirmEmailAdress,
            emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirm} ${userSaved.emailCode}`,
          });
        } else {
          if (!!userSaved.userDetails.toConfirmEmail) {
            await SendEmail({
              userEmail: userSaved.userDetails.toConfirmEmail,
              emailTitle:
                AllTexts?.ConfirmEmail?.[validContentLanguage]
                  ?.confirmEmailAdress,
              emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirm} ${userSaved.emailCode}`,
            });
          }
        }

        return res.status(200).json({
          success: true,
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

export const confirmUserAccounEmailCode = (
  userEmail: string,
  codeConfirmEmail: string,
  password: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    emailCode: codeConfirmEmail.toUpperCase(),
    password: {$ne: null},
    banned: false,
  })
    .select("email emailCode userDetails phoneDetails password phoneCode")
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
              userData.phoneCode = randomCodePhone.toUpperCase();
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
            AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.confirmedEmailAdress,
          emailContent:
            AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.confirmedTextEmailAdress,
        });

        if (userSaved.email === userEmail) {
          if (
            !!userSaved.phoneDetails.number &&
            !!userSaved.phoneDetails.regionalCode &&
            !!userSaved.phoneCode
          ) {
            await SendSMS({
              phoneDetails: userSaved.phoneDetails,
              message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${userSaved.phoneCode}`,
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
                AllTexts?.ConfirmEmail?.[validContentLanguage]
                  ?.confirmedEmailAdress,
              body: AllTexts?.ConfirmEmail?.[validContentLanguage]
                ?.confirmedTextEmailAdress,
            },
            forceEmail: true,
            forceSocket: true,
            res: res,
          });

          return res.status(200).json({
            success: true,
            data: {
              email: userSaved.email,
              emailConfirmed: true,
              dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
            },
            message:
              AllTexts?.ConfirmEmail?.[validContentLanguage]
                ?.confirmedTextEmailAdress,
          });
        } else {
          return res.status(200).json({
            success: true,
            data: {
              email: userSaved.email,
              emailConfirmed: true,
              dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
            },
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidCode,
          });
        }
      } else {
        return res.status(422).json({
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundCodeOrPassword,
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

export const changeUserAccounEmail = (
  userEmail: string,
  password: string,
  newEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    password: {$ne: null},
    emailCode: null,
    "userDetails.emailIsConfirmed": true,
    "userDetails.toConfirmEmail": null,
    banned: false,
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
              banned: false,
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
              AllTexts?.ConfirmEmail?.[validContentLanguage]
                ?.confirmEmailAdress,
            emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirm} ${userSaved.emailCode}`,
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            toConfirmEmail: userSaved.userDetails.toConfirmEmail,
          },
          message:
            AllTexts?.ConfirmEmail?.[validContentLanguage]?.smsConfirmEmailSend,
        });
      } else {
        return res.status(422).json({
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]
              ?.notFoundOrPasswordEmail,
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
    banned: false,
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
        return res.status(200).json({
          success: true,
          message: AllTexts?.ConfirmEmail?.[validContentLanguage]?.resetEmail,
        });
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidCode,
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
