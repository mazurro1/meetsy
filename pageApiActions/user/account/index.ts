import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {SendEmail, verifyPassword, randomString, hashPassword} from "@lib";
import {EnumUserConsents} from "@/models/User/user.model";
import Alert from "@/models/Alert/alert";

export const getUserAccount = async (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select(
      "email userDetails phoneDetails.has phoneDetails.isConfirmed phoneDetails.number phoneDetails.dateSendAgainSMS phoneDetails.toConfirmNumber consents"
    );
    if (!!findUser) {
      const findUserAlerts = await Alert.countDocuments({
        userId: findUser._id,
        active: true,
      });

      let activeAlertsCount: number = 0;

      if (!!findUserAlerts) {
        activeAlertsCount = findUserAlerts;
      }

      return res.status(200).json({
        data: {
          userData: findUser,
          activeAlertsCount: activeAlertsCount,
        },
        success: true,
      });
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const deleteUserAccount = async (
  userErmail: string,
  password: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("email password userDetails.emailIsConfirmed");
    if (!!findUser) {
      let clearToDeleteAccount: boolean = false;

      if (!!findUser.password) {
        const isValidPassword = await verifyPassword(
          password,
          findUser.password
        );
        if (isValidPassword) {
          clearToDeleteAccount = true;
        }
      } else {
        clearToDeleteAccount = true;
      }

      if (!!findUser.userDetails.emailIsConfirmed) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts[validContentLanguage]?.AccountApi?.accountDeleted,
          emailContent:
            AllTexts[validContentLanguage]?.AccountApi.accountDeletedText,
        });
      }

      if (clearToDeleteAccount) {
        const result = await findUser.remove();
        if (!!result) {
          return res.status(200).json({
            data: findUser,
            success: true,
            message: AllTexts[validContentLanguage]?.AccountApi?.accountDeleted,
          });
        } else {
          res.status(501).json({
            success: false,
            message:
              AllTexts[validContentLanguage]?.ApiErrors.somethingWentWrong,
          });
        }
      } else {
        return res.status(422).json({
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.notFoundOrPassword,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const updateUserAccount = async (
  userErmail: string,
  name: string,
  surname: string,
  password: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
      password: {$ne: null},
    }).select("email userDetails password");
    if (!!findUser) {
      if (!!findUser.password) {
        const isValidPassword = await verifyPassword(
          password,
          findUser.password
        );
        if (isValidPassword) {
          findUser.userDetails.name = name.toLowerCase();
          findUser.userDetails.surname = surname.toLowerCase();

          const userSaved = await findUser.save();

          if (!!userSaved) {
            return res.status(200).json({
              data: {
                name: userSaved.userDetails.name,
                surname: userSaved.userDetails.surname,
              },
              success: true,
            });
          } else {
            res.status(501).json({
              success: false,
              message:
                AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
            });
          }
        } else {
          res.status(501).json({
            success: false,
            message:
              AllTexts[validContentLanguage]?.ApiErrors?.notFoundOrPassword,
          });
        }
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const recoverUserAccount = async (
  email: string,
  phone: number,
  phoneRegionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: email,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.number": phone,
      "phoneDetails.regionalCode": phoneRegionalCode,
      "phoneDetails.has": true,
      "phoneDetails.isConfirmed": true,
    }).select("email phoneDetails");
    if (!!findUser) {
      const randomCodeEmail = randomString(10);
      findUser.recoverCode = randomCodeEmail;
      const savedUser = await findUser.save();

      if (!!savedUser) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts[validContentLanguage]?.ConfirmEmail?.sendCodeRecoverTitle,
          emailContent: `${AllTexts[validContentLanguage]?.ConfirmEmail?.codeToRecover} ${savedUser.recoverCode}`,
        });

        return res.status(200).json({
          success: true,
          data: {
            email: savedUser.email,
          },
          message:
            AllTexts[validContentLanguage]?.ConfirmEmail?.sendCodeRecover,
        });
      } else {
        res.status(501).json({
          success: false,
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const resendRecoverUserAccount = async (
  email: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: email,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.has": true,
      "phoneDetails.isConfirmed": true,
    }).select("email phoneDetails");
    if (!!findUser) {
      const randomCodeEmail = randomString(10);
      findUser.recoverCode = randomCodeEmail;
      const savedUser = await findUser.save();

      if (!!savedUser) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts[validContentLanguage]?.ConfirmEmail?.sendCodeRecoverTitle,
          emailContent: `${AllTexts[validContentLanguage]?.ConfirmEmail?.codeToRecover} ${savedUser.recoverCode}`,
        });

        return res.status(200).json({
          success: true,
          data: {
            email: savedUser.email,
          },
          message:
            AllTexts[validContentLanguage]?.ConfirmEmail?.sendCodeRecover,
        });
      } else {
        res.status(501).json({
          success: false,
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const deleteRecoverUserAccount = async (
  email: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: email,
      password: {$ne: null},
      recoverCode: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.has": true,
      "phoneDetails.isConfirmed": true,
    }).select("email recoverCode userDetails.emailIsConfirmed");

    if (!!findUser) {
      findUser.recoverCode = null;

      if (!!findUser.userDetails.emailIsConfirmed) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts[validContentLanguage]?.AccountApi?.recoverAccountCanceled,
          emailContent:
            AllTexts[validContentLanguage]?.AccountApi
              ?.recoverAccountCanceledText,
        });
      }

      const result = await findUser.save();
      if (!!result) {
        return res.status(200).json({
          data: findUser,
          success: true,
          message:
            AllTexts[validContentLanguage]?.AccountApi
              ?.recoverAccountCanceledText,
        });
      } else {
        res.status(501).json({
          success: false,
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const updateRecoverUserAccount = async (
  email: string,
  codeRecoverAccount: string,
  newPassword: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: email,
      password: {$ne: null},
      recoverCode: codeRecoverAccount,
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.has": true,
      "phoneDetails.isConfirmed": true,
    }).select("email recoverCode userDetails.emailIsConfirmed");

    if (!!findUser) {
      const hashedPassword = await hashPassword(newPassword);
      findUser.recoverCode = null;
      findUser.password = hashedPassword;

      if (!!findUser.userDetails.emailIsConfirmed) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts[validContentLanguage]?.AccountApi?.recoverAccountCanceled,
          emailContent:
            AllTexts[validContentLanguage]?.AccountApi
              ?.recoverAccountCanceledConfirmText,
        });
      }

      const result = await findUser.save();
      if (!!result) {
        return res.status(200).json({
          data: findUser,
          success: true,
          message:
            AllTexts[validContentLanguage]?.AccountApi
              ?.recoverAccountCanceledConfirmText,
        });
      } else {
        res.status(501).json({
          success: false,
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};

export const updateConsentsUserAccount = async (
  email: string,
  password: string,
  sendSmsAllServices: boolean,
  sendEmailsAllServices: boolean,
  sendEmailsMarketing: boolean,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: email,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.has": true,
      "phoneDetails.isConfirmed": true,
    }).select("email consents password");
    if (!!findUser) {
      if (!!findUser.password) {
        const isValidPassword = await verifyPassword(
          password,
          findUser.password
        );
        if (isValidPassword) {
          const newUserConsents: number[] = [];
          if (sendSmsAllServices) {
            newUserConsents.push(EnumUserConsents.sendSmsAllServices);
          }
          if (sendEmailsAllServices) {
            newUserConsents.push(EnumUserConsents.sendEmailsAllServices);
          }
          if (sendEmailsMarketing) {
            newUserConsents.push(EnumUserConsents.sendEmailsMarketing);
          }

          findUser.consents = newUserConsents;
          const savedUser = await findUser.save();

          if (!!savedUser) {
            return res.status(200).json({
              success: true,
              data: {
                consents: savedUser.consents,
              },
              message:
                AllTexts[validContentLanguage]?.ConfirmEmail?.updateConsents,
            });
          } else {
            res.status(501).json({
              success: false,
              message:
                AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
            });
          }
        } else {
          res.status(501).json({
            success: false,
            message:
              AllTexts[validContentLanguage]?.ApiErrors?.notFoundOrPassword,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};
