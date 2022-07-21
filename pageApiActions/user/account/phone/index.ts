import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {randomString, SendSMS, UserAlertsGenerator, verifyPassword} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const sendAgainUserAccounPhoneCode = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    phoneCode: {$ne: null},
    "phoneDetails.has": true,
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
    banned: false,
  })
    .select("email phoneDetails phoneCode")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.phoneCode = randomCodeEmail.toUpperCase();
        userData.phoneDetails.dateSendAgainSMS = new Date(
          new Date().setHours(new Date().getHours() + 1)
        );
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        if (
          !!userSaved.phoneDetails.number &&
          !!userSaved.phoneDetails.regionalCode &&
          !!userSaved.phoneCode
        ) {
          const dataToSendSMS = userSaved.phoneDetails.isConfirmed
            ? {
                number: userSaved.phoneDetails.toConfirmNumber,
                regionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
                toConfirmNumber: userSaved.phoneDetails.toConfirmNumber,
                toConfirmRegionalCode:
                  userSaved.phoneDetails.toConfirmRegionalCode,
                dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
                has: userSaved.phoneDetails.has,
                isConfirmed: userSaved.phoneDetails.isConfirmed,
              }
            : userSaved.phoneDetails;

          const result = await SendSMS({
            phoneDetails: dataToSendSMS,
            message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${userSaved.phoneCode}`,
            forceSendUnconfirmedPhone: true,
          });
          if (result) {
            return res.status(200).json({
              success: true,
              data: {
                dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
              },
            });
          } else {
            return res.status(422).json({
              message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidCode,
              success: false,
            });
          }
        }
      }
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    })
    .catch((err) => {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    });
};

export const updateUserAccounPhone = (
  userEmail: string,
  phone: number,
  phoneRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    "phoneDetails.has": false,
    "phoneDetails.number": null,
    "phoneDetails.regionalCode": null,
    banned: false,
  })
    .select("email phoneDetails phoneCode")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.phoneCode = randomCodeEmail.toUpperCase();
        userData.phoneDetails.has = true;
        userData.phoneDetails.number = phone;
        userData.phoneDetails.regionalCode = phoneRegionalCode;
        userData.phoneDetails.dateSendAgainSMS = new Date(
          new Date().setHours(new Date().getHours() + 1)
        );
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
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

        return res.status(200).json({
          success: true,
          data: {
            phoneConfirmed: true,
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
          },
          message:
            AllTexts?.ConfirmPhone?.[validContentLanguage]?.smsConfirmPhoneSend,
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

export const confirmUserAccounPhoneCode = (
  userEmail: string,
  codeConfirmPhone: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    phoneCode: codeConfirmPhone.toUpperCase(),
    banned: false,
  })
    .select("email emailCode phoneDetails phoneCode")
    .then(async (userData) => {
      if (!!userData) {
        if (userData.phoneDetails.isConfirmed) {
          userData.phoneDetails.number = userData.phoneDetails.toConfirmNumber;
          userData.phoneDetails.regionalCode =
            userData.phoneDetails.toConfirmRegionalCode;
          userData.phoneDetails.toConfirmNumber = null;
          userData.phoneDetails.toConfirmRegionalCode = null;
        }
        userData.phoneCode = null;
        userData.phoneDetails.isConfirmed = true;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        await UserAlertsGenerator({
          data: {
            color: "GREEN",
            type: "CHANGED_PHONE_NUMBER",
            userId: userSaved._id,
            active: true,
          },
          email: {
            title:
              AllTexts?.ConfirmPhone?.[validContentLanguage]?.confirmedPhone,
            body: AllTexts?.ConfirmPhone?.[validContentLanguage]
              ?.confirmedTextPhone,
          },
          webpush: {
            title:
              AllTexts?.ConfirmPhone?.[validContentLanguage]?.confirmedPhone,
            body: AllTexts?.ConfirmPhone?.[validContentLanguage]
              ?.confirmedTextPhone,
          },
          forceEmail: true,
          forceSocket: true,
          res: res,
        });

        return res.status(200).json({
          success: true,
          message:
            AllTexts?.ConfirmPhone?.[validContentLanguage]?.confirmedTextPhone,
          data: {
            phoneConfirmed: true,
            regionalCode: userSaved.phoneDetails.regionalCode,
            number: userSaved.phoneDetails.number,
          },
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

export const deleteUserNoConfirmPhone = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    phoneCode: {$ne: null},
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.has": true,
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
    banned: false,
  })
    .select("email phoneDetails phoneCode")
    .then(async (userData) => {
      if (!!userData) {
        if (!!userData.phoneDetails.isConfirmed) {
          userData.phoneDetails.toConfirmNumber = null;
          userData.phoneDetails.toConfirmRegionalCode = null;
        } else {
          userData.phoneDetails.number = null;
          userData.phoneDetails.regionalCode = null;
          userData.phoneDetails.has = false;
          userData.phoneDetails.isConfirmed = false;
        }
        userData.phoneCode = null;
        userData.phoneDetails.dateSendAgainSMS = new Date(
          new Date().setHours(new Date().getHours() + 1)
        );
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        return res.status(200).json({
          success: true,
          message:
            AllTexts?.ConfirmPhone?.[validContentLanguage]?.resetPhoneNumber,
          data: {
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
          },
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

export const changeUserAccounPhone = (
  userEmail: string,
  password: string,
  newPhone: number,
  newRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    password: {$ne: null},
    phoneCode: null,
    "phoneDetails.has": true,
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.isConfirmed": true,
    "phoneDetails.toConfirmNumber": null,
    "phoneDetails.toConfirmRegionalCode": null,
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
    banned: false,
  })
    .select("email phoneDetails password phoneCode")
    .then(async (userData) => {
      if (!!userData) {
        if (!!userData.password) {
          const isValidPassword = await verifyPassword(
            password,
            userData.password
          );
          if (!!isValidPassword) {
            const randomCodeEmail = randomString(6);
            userData.phoneCode = randomCodeEmail.toUpperCase();
            userData.phoneDetails.toConfirmNumber = newPhone;
            userData.phoneDetails.toConfirmRegionalCode = newRegionalCode;
            userData.phoneDetails.dateSendAgainSMS = new Date(
              new Date().setHours(new Date().getHours() + 1)
            );
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
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        if (
          !!userSaved.phoneDetails.number &&
          !!userSaved.phoneDetails.regionalCode &&
          !!userSaved.phoneCode
        ) {
          const toConfirmedPhoneDetails = {
            number: userSaved.phoneDetails.toConfirmNumber,
            toConfirmNumber: userSaved.phoneDetails.toConfirmNumber,
            regionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            toConfirmRegionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            has: userSaved.phoneDetails.has,
            isConfirmed: false,
          };

          await SendSMS({
            phoneDetails: toConfirmedPhoneDetails,
            message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${userSaved.phoneCode}`,
            forceSendUnconfirmedPhone: true,
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            toConfirmNumber: userSaved.phoneDetails.toConfirmNumber,
            toConfirmRegionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
          },
          message:
            AllTexts?.ConfirmPhone?.[validContentLanguage]?.smsConfirmPhoneSend,
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
