import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  randomString,
  SendEmail,
  SendSMS,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
} from "@lib";

export const sendAgainEmailVerification = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const userHasAccess =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!userHasAccess) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      "companyDetails.emailIsConfirmed": false,
      emailCode: {$ne: null},
    }).select("email emailCode companyDetails.emailIsConfirmed");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const randomCodeEmail = randomString(6);
    findCompany.emailCode = randomCodeEmail.toUpperCase();
    findCompany.companyDetails.emailIsConfirmed = false;
    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
    if (!savedCompany.email) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await SendEmail({
      userEmail: savedCompany.email,
      emailTitle:
        AllTexts?.ConfirmEmail?.[validContentLanguage]
          ?.confirmEmailAdressCompany,
      emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirmCompany} ${savedCompany.emailCode}`,
    });

    return res.status(200).json({
      success: true,
      message:
        AllTexts?.ConfirmEmail?.[validContentLanguage]?.smsConfirmEmailSend,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
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
    const userHasAccess =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!userHasAccess) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      "companyDetails.emailIsConfirmed": false,
      emailCode: {$ne: null},
    }).select("email emailCode companyDetails.emailIsConfirmed phoneDetails");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    if (codeConfirmEmail !== findCompany.emailCode) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
        success: false,
      });
    }

    findCompany.companyDetails.emailIsConfirmed = true;
    findCompany.emailCode = null;

    const randomCodePhone = randomString(6);
    if (
      !!findCompany.phoneDetails.number &&
      !!findCompany.phoneDetails.regionalCode
    ) {
      findCompany.phoneDetails.code = randomCodePhone.toUpperCase();
      findCompany.phoneDetails.dateSendAgainSMS = new Date(
        new Date().setHours(new Date().getHours() + 1)
      );
    }

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }

    if (!savedCompany.email) {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }

    await SendEmail({
      userEmail: savedCompany.email,
      emailTitle:
        AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmedEmailAdress,
      emailContent:
        AllTexts?.ConfirmEmail?.[validContentLanguage]
          ?.confirmedTextEmailAdress,
    });

    if (!!!savedCompany.phoneDetails) {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }
    if (
      !!!savedCompany.phoneDetails.number ||
      !!!savedCompany.phoneDetails.regionalCode ||
      !!!savedCompany.phoneDetails.code
    ) {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }

    await SendSMS({
      phoneDetails: savedCompany.phoneDetails,
      message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${savedCompany.phoneDetails.code}`,
      forceSendUnconfirmedPhone: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
        emailIsConfirmed: savedCompany.companyDetails.emailIsConfirmed,
      },
      message:
        AllTexts?.ConfirmEmail?.[validContentLanguage]
          ?.confirmedTextEmailAdress,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
