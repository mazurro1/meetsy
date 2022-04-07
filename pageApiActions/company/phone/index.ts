import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {
  randomString,
  SendSMS,
  UserAlertsGenerator,
  verifyPassword,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import Company from "@/models/Company/company";

export const sendAgainCompanyAccounPhoneCode = async (
  userErmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const userHasAccess =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userErmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!userHasAccess) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      "phoneDetails.has": true,
      "phoneDetails.code": {$ne: null},
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.dateSendAgainSMS": {
        $lte: new Date(),
      },
    }).select("email phoneDetails");

    if (!!!findCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    const randomCodeEmail = randomString(6);
    findCompany.phoneDetails.code = randomCodeEmail;
    findCompany.phoneDetails.dateSendAgainSMS = new Date(
      new Date().setHours(new Date().getHours() + 1)
    );
    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    const result = await SendSMS({
      phoneDetails: savedCompany.phoneDetails,
      message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${savedCompany.phoneDetails.code}`,
      forceSendUnconfirmedPhone: true,
    });

    if (!!!result) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      success: false,
    });
    return;
  }
};

export const updateCompanyAccounPhone = async (
  userErmail: string,
  phone: number,
  phoneRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
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
          message:
            AllTexts[validContentLanguage]?.ConfirmPhone?.smsConfirmPhoneSend,
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

export const confirmUserAccounPhoneCode = (
  userEmail: string,
  codeConfirmPhone: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    "phoneDetails.code": codeConfirmPhone,
  })
    .select("email emailCode phoneDetails")
    .then(async (userData) => {
      if (!!userData) {
        if (userData.phoneDetails.isConfirmed) {
          userData.phoneDetails.number = userData.phoneDetails.toConfirmNumber;
          userData.phoneDetails.regionalCode =
            userData.phoneDetails.toConfirmRegionalCode;
          userData.phoneDetails.toConfirmNumber = null;
          userData.phoneDetails.toConfirmRegionalCode = null;
        }
        userData.phoneDetails.code = null;
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
            title: AllTexts[validContentLanguage]?.ConfirmPhone?.confirmedPhone,
            body: AllTexts[validContentLanguage]?.ConfirmPhone
              ?.confirmedTextPhone,
          },
          webpush: {
            title: AllTexts[validContentLanguage]?.ConfirmPhone?.confirmedPhone,
            body: AllTexts[validContentLanguage]?.ConfirmPhone
              ?.confirmedTextPhone,
          },
          forceEmail: true,
          forceSocket: true,
          res: res,
        });

        res.status(200).json({
          success: true,
          message:
            AllTexts[validContentLanguage]?.ConfirmPhone?.confirmedTextPhone,
          data: {
            phoneConfirmed: true,
            regionalCode: userSaved.phoneDetails.regionalCode,
            number: userSaved.phoneDetails.number,
          },
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

export const deleteUserNoConfirmPhone = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
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
        if (!!userData.phoneDetails.isConfirmed) {
          userData.phoneDetails.toConfirmNumber = null;
          userData.phoneDetails.toConfirmRegionalCode = null;
        } else {
          userData.phoneDetails.number = null;
          userData.phoneDetails.regionalCode = null;
          userData.phoneDetails.has = false;
          userData.phoneDetails.isConfirmed = false;
        }
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
          message:
            AllTexts[validContentLanguage]?.ConfirmPhone?.resetPhoneNumber,
          data: {
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
          },
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

export const changeUserAccounPhone = (
  userErmail: string,
  password: string,
  newPhone: number,
  newRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userErmail,
    password: {$ne: null},
    "phoneDetails.has": true,
    "phoneDetails.number": {$ne: null},
    "phoneDetails.regionalCode": {$ne: null},
    "phoneDetails.isConfirmed": true,
    "phoneDetails.code": null,
    "phoneDetails.toConfirmNumber": null,
    "phoneDetails.toConfirmRegionalCode": null,
    "phoneDetails.dateSendAgainSMS": {
      $lte: new Date(),
    },
  })
    .select("email phoneDetails password")
    .then(async (userData) => {
      if (!!userData) {
        if (!!userData.password) {
          const isValidPassword = await verifyPassword(
            password,
            userData.password
          );
          if (!!isValidPassword) {
            const randomCodeEmail = randomString(6);
            userData.phoneDetails.code = randomCodeEmail;

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
          !!userSaved.phoneDetails.code
        ) {
          const toConfirmedPhoneDetails = {
            number: userSaved.phoneDetails.toConfirmNumber,
            toConfirmNumber: userSaved.phoneDetails.toConfirmNumber,
            regionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            toConfirmRegionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            code: userSaved.phoneDetails.code,
            has: userSaved.phoneDetails.has,
            isConfirmed: false,
          };

          await SendSMS({
            phoneDetails: toConfirmedPhoneDetails,
            message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${userSaved.phoneDetails.code}`,
            forceSendUnconfirmedPhone: true,
          });
        }

        res.status(200).json({
          success: true,
          data: {
            toConfirmNumber: userSaved.phoneDetails.toConfirmNumber,
            toConfirmRegionalCode: userSaved.phoneDetails.toConfirmRegionalCode,
            dateSendAgainSMS: userSaved.phoneDetails.dateSendAgainSMS,
          },
          message:
            AllTexts[validContentLanguage]?.ConfirmPhone?.smsConfirmPhoneSend,
        });
      } else {
        res.status(422).json({
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.notFoundOrPassword,
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
