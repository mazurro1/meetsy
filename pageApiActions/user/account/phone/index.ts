import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {randomString, SendSMS, SendEmail} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const sendAgainUserAccounPhoneCode = (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    "phoneDetails.has": true,
    "phoneDetails.isConfirmed": false,
    "phoneDetails.code": {$ne: null},
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
  })
    .select("email phoneDetails")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.phoneDetails.code = randomCodeEmail;
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
          !!userSaved.phoneDetails.code
        ) {
          const result = await SendSMS({
            phoneDetails: userSaved.phoneDetails,
            message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${userSaved.phoneDetails.code}`,
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
              message: AllTexts[validContentLanguage].ApiErrors.invalidCode,
              success: false,
            });
          }
        }
      }
      return res.status(422).json({
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
        success: false,
      });
    })
    .catch((err) => {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
      });
    });
};

export const updateUserAccounPhone = (
  userErmail: string,
  phone: number,
  phoneRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    "phoneDetails.has": false,
    "phoneDetails.number": null,
    "phoneDetails.regionalCode": null,
  })
    .select("email phoneDetails")
    .then(async (userData) => {
      if (!!userData) {
        const randomCodeEmail = randomString(6);
        userData.phoneDetails.code = randomCodeEmail;
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
          !!userSaved.phoneDetails.code
        ) {
          await SendSMS({
            phoneDetails: userSaved.phoneDetails,
            message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${userSaved.phoneDetails.code}`,
            forceSendUnconfirmedPhone: true,
          });
        }

        res.status(200).json({
          success: true,
          data: {
            phoneConfirmed: true,
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
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
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
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
    "phoneDetails.isConfirmed": false,
    "phoneDetails.code": codeConfirmPhone,
  })
    .select("email emailCode phoneDetails")
    .then(async (userData) => {
      if (!!userData) {
        userData.phoneDetails.code = null;
        userData.phoneDetails.isConfirmed = true;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        await SendEmail({
          userEmail: userSaved.email,
          emailTitle:
            AllTexts[validContentLanguage].ConfirmPhone.confirmedPhone,
          emailContent:
            AllTexts[validContentLanguage].ConfirmPhone.confirmedTextPhone,
        });

        res.status(200).json({
          success: true,
          message:
            AllTexts[validContentLanguage].ConfirmPhone.confirmedTextPhone,
          data: {
            phoneConfirmed: true,
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
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
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
    "phoneDetails.isConfirmed": false,
    "phoneDetails.code": {$ne: null},
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.has": true,
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
  })
    .select("email phoneDetails")
    .then(async (userData) => {
      if (!!userData) {
        userData.phoneDetails.number = null;
        userData.phoneDetails.regionalCode = null;
        userData.phoneDetails.has = false;
        userData.phoneDetails.isConfirmed = false;
        userData.phoneDetails.code = null;
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
        res.status(200).json({
          success: true,
          message: AllTexts[validContentLanguage].ConfirmPhone.resetPhoneNumber,
          data: {
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
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
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
      });
    });
};
