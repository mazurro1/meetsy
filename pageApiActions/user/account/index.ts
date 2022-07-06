import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  SendEmail,
  verifyPassword,
  randomString,
  hashPassword,
  UserAlertsGenerator,
} from "@lib";
import {EnumUserConsents} from "@/models/User/user.model";
import Alert from "@/models/Alert/alert";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";

export const getUserAccount = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userEmail.toLowerCase(),
    }).select(
      "email userDetails phoneDetails consents defaultCompanyId permissions"
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
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
    });
  }
};

export const deleteUserAccount = async (
  userEmail: string,
  password: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userEmail,
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

      if (clearToDeleteAccount) {
        const userInWorks = await CompanyWorker.countDocuments({
          userId: findUser._id,
          active: true,
        });

        if (!!!userInWorks) {
          await CompanyWorker.deleteMany({
            userId: findUser._id,
            active: false,
          });

          if (!!findUser.userDetails.emailIsConfirmed) {
            await SendEmail({
              userEmail: findUser.email,
              emailTitle:
                AllTexts?.AccountApi?.[validContentLanguage]?.accountDeleted,
              emailContent:
                AllTexts?.AccountApi?.[validContentLanguage]
                  ?.accountDeletedText,
            });
          }

          const result = await findUser.remove();
          if (!!result) {
            return res.status(200).json({
              data: findUser,
              success: true,
              message:
                AllTexts?.AccountApi?.[validContentLanguage]?.accountDeleted,
            });
          } else {
            return res.status(501).json({
              success: false,
              message:
                AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
            });
          }
        } else {
          return res.status(422).json({
            success: false,
            message:
              AllTexts?.ApiErrors?.[validContentLanguage]?.deleteAccountDanied,
          });
        }
      } else {
        return res.status(422).json({
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundOrPassword,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
    });
  }
};

export const updateUserAccount = async (
  userEmail: string,
  name: string,
  surname: string,
  password: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userEmail,
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
            await UserAlertsGenerator({
              data: {
                color: "GREEN",
                type: "CHANGED_ACCOUNT_PROPS",
                userId: userSaved._id,
                active: true,
              },
              email: null,
              webpush: null,
              forceEmail: false,
              forceSocket: true,
              res: res,
            });

            return res.status(200).json({
              data: {
                name: userSaved.userDetails.name,
                surname: userSaved.userDetails.surname,
              },
              success: true,
            });
          } else {
            return res.status(501).json({
              success: false,
              message:
                AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
            });
          }
        } else {
          return res.status(501).json({
            success: false,
            message:
              AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundOrPassword,
          });
        }
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
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
      findUser.recoverCode = randomCodeEmail.toUpperCase();
      const savedUser = await findUser.save();

      if (!!savedUser) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.sendCodeRecoverTitle,
          emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToRecover} ${savedUser.recoverCode}`,
        });

        return res.status(200).json({
          success: true,
          data: {
            email: savedUser.email,
          },
          message:
            AllTexts?.ConfirmEmail?.[validContentLanguage]?.sendCodeRecover,
        });
      } else {
        return res.status(501).json({
          success: false,
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
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
      findUser.recoverCode = randomCodeEmail.toUpperCase();
      const savedUser = await findUser.save();

      if (!!savedUser) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle:
            AllTexts?.ConfirmEmail?.[validContentLanguage]
              ?.sendCodeRecoverTitle,
          emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToRecover} ${savedUser.recoverCode}`,
        });

        return res.status(200).json({
          success: true,
          data: {
            email: savedUser.email,
          },
          message:
            AllTexts?.ConfirmEmail?.[validContentLanguage]?.sendCodeRecover,
        });
      } else {
        return res.status(501).json({
          success: false,
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
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
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceled,
          emailContent:
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceledText,
        });
      }

      const result = await findUser.save();
      if (!!result) {
        return res.status(200).json({
          data: findUser,
          success: true,
          message:
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceledText,
        });
      } else {
        return res.status(501).json({
          success: false,
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
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
      recoverCode: codeRecoverAccount.toUpperCase(),
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
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceled,
          emailContent:
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceledConfirmText,
        });
      }

      const result = await findUser.save();
      if (!!result) {
        return res.status(200).json({
          data: findUser,
          success: true,
          message:
            AllTexts?.AccountApi?.[validContentLanguage]
              ?.recoverAccountCanceledConfirmText,
        });
      } else {
        return res.status(501).json({
          success: false,
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
    });
  }
};

export const updateConsentsUserAccount = async (
  email: string,
  password: string,
  sendSmsAllServices: boolean,
  sendEmailsAllServices: boolean,
  sendEmailsMarketing: boolean,
  sendNotifications: boolean,
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
          if (sendNotifications) {
            newUserConsents.push(EnumUserConsents.sendNotifications);
          }

          findUser.consents = newUserConsents;
          const savedUser = await findUser.save();

          if (!!savedUser) {
            await UserAlertsGenerator({
              data: {
                color: "GREEN",
                type: "CHANGED_CONSENTS",
                userId: savedUser._id,
                active: true,
              },
              email: null,
              webpush: null,
              forceEmail: false,
              forceSocket: true,
              res: res,
            });

            return res.status(200).json({
              success: true,
              data: {
                consents: savedUser.consents,
              },
              message:
                AllTexts?.ConfirmEmail?.[validContentLanguage]?.updateConsents,
            });
          } else {
            return res.status(501).json({
              success: false,
              message:
                AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
            });
          }
        } else {
          return res.status(501).json({
            success: false,
            message:
              AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundOrPassword,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
    });
  }
};
