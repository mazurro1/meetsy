import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {randomString, SendEmail, UserAlertsGenerator, SendSMS} from "@lib";

export const sendAgainEmailVerification = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const user = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.isConfirmed": true,
    }).select("email _id");
    if (!user) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
        success: false,
      });
      return;
    }

    const findUserCompanyWorker = await CompanyWorker.findOne({
      userId: user._id,
      companyId: companyId,
      permissions: {$in: [EnumWorkerPermissions.admin]},
    });

    if (!findUserCompanyWorker) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await Company.findOne({
      _id: findUserCompanyWorker.companyId,
      "companyDetails.emailIsConfirmed": false,
      emailCode: {$ne: null},
    }).select("email emailCode companyDetails.emailIsConfirmed");
    if (!findCompany) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const randomCodeEmail = randomString(6);
    findCompany.emailCode = randomCodeEmail;
    findCompany.companyDetails.emailIsConfirmed = false;
    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }
    if (!savedCompany.email) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    await SendEmail({
      userEmail: savedCompany.email,
      emailTitle:
        AllTexts[validContentLanguage].ConfirmEmail.confirmEmailAdressCompany,
      emailContent: `${AllTexts[validContentLanguage].ConfirmEmail.codeToConfirmCompany} ${savedCompany.emailCode}`,
    });

    res.status(200).json({
      success: true,
      message:
        AllTexts[validContentLanguage]?.ConfirmEmail?.smsConfirmEmailSend,
    });
  } catch (error) {
    res.status(500).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      success: false,
    });
    return;
  }
};

export const confirmCompanyAccounEmailCode = async (
  userEmail: string,
  companyId: string,
  codeConfirmEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const user = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.isConfirmed": true,
    }).select("email _id");
    if (!user) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
        success: false,
      });
      return;
    }

    const findUserCompanyWorker = await CompanyWorker.findOne({
      userId: user._id,
      companyId: companyId,
      permissions: {$in: [EnumWorkerPermissions.admin]},
    });

    if (!findUserCompanyWorker) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await Company.findOne({
      _id: findUserCompanyWorker.companyId,
      "companyDetails.emailIsConfirmed": false,
      emailCode: {$ne: null},
    }).select("email emailCode companyDetails.emailIsConfirmed phoneDetails");
    if (!findCompany) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    if (codeConfirmEmail !== findCompany.emailCode) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
        success: false,
      });
      return;
    }

    findCompany.companyDetails.emailIsConfirmed = true;
    findCompany.emailCode = null;

    const randomCodePhone = randomString(6);
    if (
      !!findCompany.phoneDetails.number &&
      !!findCompany.phoneDetails.regionalCode
    ) {
      findCompany.phoneDetails.code = randomCodePhone;
      findCompany.phoneDetails.dateSendAgainSMS = new Date(
        new Date().setHours(new Date().getHours() + 1)
      );
    }

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
      return;
    }

    if (!savedCompany.email) {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
      return;
    }

    await SendEmail({
      userEmail: savedCompany.email,
      emailTitle:
        AllTexts[validContentLanguage]?.ConfirmEmail?.confirmedEmailAdress,
      emailContent:
        AllTexts[validContentLanguage]?.ConfirmEmail?.confirmedTextEmailAdress,
    });

    if (!!!savedCompany.phoneDetails) {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
      return;
    }
    if (
      !!!savedCompany.phoneDetails.number ||
      !!!savedCompany.phoneDetails.regionalCode ||
      !!!savedCompany.phoneDetails.code
    ) {
      res.status(501).json({
        success: false,
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      });
      return;
    }

    await SendSMS({
      phoneDetails: savedCompany.phoneDetails,
      message: `${AllTexts[validContentLanguage]?.ConfirmPhone?.codeToConfirm} ${savedCompany.phoneDetails.code}`,
      forceSendUnconfirmedPhone: true,
    });

    res.status(200).json({
      success: true,
      data: {
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
        emailIsConfirmed: savedCompany.companyDetails.emailIsConfirmed,
      },
      message:
        AllTexts[validContentLanguage]?.ConfirmEmail?.confirmedTextEmailAdress,
    });
  } catch (error) {
    res.status(500).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      success: false,
    });
    return;
  }
};
