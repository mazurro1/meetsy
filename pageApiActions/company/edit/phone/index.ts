import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  randomString,
  UserAlertsGenerator,
  SendSMS,
} from "@lib";
import Company from "@/models/Company/company";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const updateCompanyPhone = async (
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
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      email: {$ne: null},
      phoneCode: null,
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "companyDetails.emailIsConfirmed": true,
      "phoneDetails.toConfirmNumber": null,
      "phoneDetails.toConfirmRegionalCode": null,
      "phoneDetails.dateSendAgainSMS": {
        $lte: new Date(),
      },
    }).select("_id phoneDetails phoneCode");

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (
      (findCompany.phoneDetails.number === newPhone ||
        findCompany.phoneDetails.toConfirmNumber === newPhone) &&
      (findCompany.phoneDetails.regionalCode === newRegionalCode ||
        findCompany.phoneDetails.toConfirmRegionalCode === newRegionalCode)
    ) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
        success: false,
      });
    }
    const randomCodeEmail = randomString(6);
    findCompany.phoneCode = randomCodeEmail.toUpperCase();
    findCompany.phoneDetails.toConfirmNumber = newPhone;
    findCompany.phoneDetails.toConfirmRegionalCode = newRegionalCode;
    findCompany.phoneDetails.dateSendAgainSMS = new Date(
      new Date().setHours(new Date().getHours() + 1)
    );

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (
      !!!savedCompany.phoneDetails.toConfirmNumber ||
      !!!savedCompany.phoneDetails.toConfirmRegionalCode
    ) {
      return res.status(422).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    }

    const dataToSend = {
      number: savedCompany.phoneDetails.toConfirmNumber,
      regionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
      toConfirmNumber: savedCompany.phoneDetails.toConfirmNumber,
      toConfirmRegionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
      dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      has: savedCompany.phoneDetails.has,
      isConfirmed: savedCompany.phoneDetails.isConfirmed,
    };

    const result = await SendSMS({
      phoneDetails: dataToSend,
      message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${savedCompany.phoneCode}`,
    });

    if (!!!result) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: AllTexts?.Company?.[validContentLanguage]?.updatedCompanyProps,
      data: {
        toConfirmNumber: savedCompany.phoneDetails.toConfirmNumber,
        toConfirmRegionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const sendAgainPhoneVerification = async (
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
      email: {$ne: null},
      phoneCode: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.toConfirmNumber": {$ne: null},
      "phoneDetails.toConfirmRegionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "companyDetails.emailIsConfirmed": true,
      "phoneDetails.dateSendAgainSMS": {
        $lte: new Date(),
      },
    }).select("phoneDetails phoneCode");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const randomCodeEmail = randomString(6);
    findCompany.phoneCode = randomCodeEmail.toUpperCase();
    findCompany.phoneDetails.dateSendAgainSMS = new Date(
      new Date().setHours(new Date().getHours() + 1)
    );

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
    if (
      !!!savedCompany.phoneDetails.toConfirmNumber ||
      !!!savedCompany.phoneDetails.toConfirmRegionalCode
    ) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const dataToSend = {
      number: savedCompany.phoneDetails.toConfirmNumber,
      regionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
      toConfirmNumber: savedCompany.phoneDetails.toConfirmNumber,
      toConfirmRegionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
      dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      has: savedCompany.phoneDetails.has,
      isConfirmed: savedCompany.phoneDetails.isConfirmed,
    };

    const result = await SendSMS({
      phoneDetails: dataToSend,
      message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${savedCompany.phoneCode}`,
    });

    if (!!!result) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        AllTexts?.ConfirmPhone?.[validContentLanguage]?.smsConfirmPhoneSend,
      data: {
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const cancelPhoneVerification = async (
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
      email: {$ne: null},
      phoneCode: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.toConfirmNumber": {$ne: null},
      "phoneDetails.toConfirmRegionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "companyDetails.emailIsConfirmed": true,
    }).select("phoneDetails phoneCode");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    findCompany.phoneCode = null;
    findCompany.phoneDetails.toConfirmNumber = null;
    findCompany.phoneDetails.toConfirmRegionalCode = null;

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
        AllTexts?.ConfirmPhone?.[validContentLanguage]?.resetNewPhoneNumber,
      data: {
        toConfirmNumber: savedCompany.phoneDetails.toConfirmNumber,
        toConfirmRegionalCode: savedCompany.phoneDetails.toConfirmRegionalCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const confirmCodeCompanyPhone = async (
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
      email: {$ne: null},
      phoneCode: codeConfirmEmail.toUpperCase(),
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.toConfirmNumber": {$ne: null},
      "phoneDetails.toConfirmRegionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "companyDetails.emailIsConfirmed": true,
    }).select("phoneDetails phoneCode stripeCustomerId");
    if (!findCompany) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidCode,
        success: false,
      });
    }

    if (!!findCompany.phoneDetails.toConfirmNumber) {
      findCompany.phoneDetails.number =
        findCompany.phoneDetails.toConfirmNumber;
    }

    if (!!findCompany.phoneDetails.toConfirmRegionalCode) {
      findCompany.phoneDetails.regionalCode =
        findCompany.phoneDetails.toConfirmRegionalCode;
    }

    findCompany.phoneCode = null;
    findCompany.phoneDetails.toConfirmNumber = null;
    findCompany.phoneDetails.toConfirmRegionalCode = null;

    const savedCompany = await findCompany.save();

    if (!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!savedCompany?.stripeCustomerId) {
      await stripe.customers.update(savedCompany.stripeCustomerId, {
        phone: !!savedCompany?.phoneDetails?.number
          ? savedCompany?.phoneDetails?.number?.toString()
          : undefined,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "CHANGED_COMPANY_PHONE",
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
      message: AllTexts?.ConfirmPhone?.[validContentLanguage]?.confirmedPhone,
      data: {
        number: findCompany.phoneDetails.number,
        regionalCode: findCompany.phoneDetails.regionalCode,
        toConfirmNumber: findCompany.phoneDetails.toConfirmNumber,
        toConfirmRegionalCode: findCompany.phoneDetails.toConfirmRegionalCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
