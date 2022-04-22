import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  findValidCompany,
  randomString,
  SendEmail,
  UserAlertsGenerator,
} from "@lib";
import Company from "@/models/Company/company";

export const updateCompanyEmail = async (
  userEmail: string,
  companyId: string,
  newEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const userHasAccess =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [
          EnumWorkerPermissions.admin,
          EnumWorkerPermissions.manageCompanyInformations,
        ],
      });

    if (!userHasAccess) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await findValidCompany({
      companyId: companyId,
      select: "_id email companyDetails.toConfirmEmail emailCode",
    });

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const hasAnyCompanyTheSameEmail = await Company.countDocuments({
      email: newEmail.toLowerCase(),
    });

    if (!!hasAnyCompanyTheSameEmail) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundEmail,
        success: false,
      });
    }

    if (
      findCompany.email?.toLowerCase() === newEmail.toLowerCase() ||
      findCompany.companyDetails.toConfirmEmail?.toLowerCase() ===
        newEmail.toLowerCase()
    ) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
        success: false,
      });
    }
    const randomCodeEmail = randomString(6);
    findCompany.emailCode = randomCodeEmail.toUpperCase();
    findCompany.companyDetails.toConfirmEmail = newEmail.toLowerCase();

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!savedCompany.companyDetails.toConfirmEmail) {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }

    await SendEmail({
      userEmail: savedCompany.companyDetails.toConfirmEmail,
      emailTitle:
        AllTexts?.ConfirmEmail?.[validContentLanguage]
          ?.confirmEmailAdressCompany,
      emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirm} ${savedCompany.emailCode}`,
    });

    return res.status(200).json({
      success: true,
      message: AllTexts?.Company?.[validContentLanguage]?.updatedCompanyProps,
      data: {
        toConfirmEmail: savedCompany.companyDetails.toConfirmEmail,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

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
      emailCode: {$ne: null},
      email: {$ne: null},
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
      "companyDetails.toConfirmEmail": {$ne: null},
    }).select("emailCode companyDetails.toConfirmEmail");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const randomCodeEmail = randomString(6);
    findCompany.emailCode = randomCodeEmail.toUpperCase();

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
    if (!savedCompany.companyDetails.toConfirmEmail) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await SendEmail({
      userEmail: savedCompany.companyDetails.toConfirmEmail,
      emailTitle:
        AllTexts?.ConfirmEmail?.[validContentLanguage]
          ?.confirmEmailAdressCompany,
      emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirm} ${savedCompany.emailCode}`,
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

export const cancelEmailVerification = async (
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
      emailCode: {$ne: null},
      email: {$ne: null},
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
      "companyDetails.toConfirmEmail": {$ne: null},
    }).select("emailCode companyDetails.toConfirmEmail");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    findCompany.emailCode = null;
    findCompany.companyDetails.toConfirmEmail = null;

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        AllTexts?.ConfirmEmail?.[validContentLanguage]?.canceledChangeEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const confirmCodeCompanyEmail = async (
  userEmail: string,
  companyId: string,
  codeConfirmEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [EnumWorkerPermissions.admin],
      });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      emailCode: codeConfirmEmail,
      email: {$ne: null},
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
      "companyDetails.toConfirmEmail": {$ne: null},
    }).select("email emailCode companyDetails.toConfirmEmail");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidCode,
        success: false,
      });
    }

    if (!!findCompany.companyDetails.toConfirmEmail) {
      findCompany.email = findCompany.companyDetails.toConfirmEmail;
    }
    findCompany.emailCode = null;
    findCompany.companyDetails.toConfirmEmail = null;

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
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

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "CHANGED_COMPANY_EMAIL",
        userId: selectedUser._id,
        companyId: companyId,
        active: true,
      },
      email: null,
      webpush: null,
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    return res.status(200).json({
      success: true,
      message:
        AllTexts?.ConfirmEmail?.[validContentLanguage]?.confirmedEmailAdress,
      data: {
        email: savedCompany.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
