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
      "phoneDetails.isConfirmed": false,
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
    findCompany.phoneDetails.code = randomCodeEmail.toUpperCase();
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

export const confirmCompanyAccounPhoneCode = async (
  userEmail: string,
  companyId: string,
  codeConfirmPhone: string,
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
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      "phoneDetails.has": true,
      "phoneDetails.code": codeConfirmPhone.toUpperCase(),
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": false,
      "phoneDetails.regionalCode": {$ne: null},
    }).select("phoneDetails.code phoneDetails.isConfirmed");

    if (!!!findCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    findCompany.phoneDetails.code = null;
    findCompany.phoneDetails.isConfirmed = true;

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: AllTexts[validContentLanguage]?.Company?.confirmedPhone,
      data: {
        phoneConfirmed: savedCompany.phoneDetails.isConfirmed,
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

export const resetPhoneNumberCompany = async (
  userEmail: string,
  companyId: string,
  newPhone: number,
  newRegionalCode: number,
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
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": false,
      "phoneDetails.regionalCode": {$ne: null},
    }).select("phoneDetails");

    if (!!!findCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    const randomCodePhone = randomString(6);
    findCompany.phoneDetails.code = randomCodePhone.toUpperCase();
    findCompany.phoneDetails.number = newPhone;
    findCompany.phoneDetails.regionalCode = newRegionalCode;
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
      message: AllTexts[validContentLanguage]?.Company?.confirmedPhone,
      data: {
        number: savedCompany.phoneDetails.number,
        regionalCode: savedCompany.phoneDetails.regionalCode,
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
