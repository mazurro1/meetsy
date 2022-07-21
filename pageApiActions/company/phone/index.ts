import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {
  randomString,
  SendSMS,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
} from "@lib";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import Company from "@/models/Company/company";
import Stripe from "stripe";
import {showValidPostalCode} from "@functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const sendAgainCompanyAccounPhoneCode = async (
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
      phoneCode: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": false,
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.dateSendAgainSMS": {
        $lte: new Date(),
      },
    }).select("email phoneDetails phoneCode");

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const randomCodeEmail = randomString(6);
    findCompany.phoneCode = randomCodeEmail.toUpperCase();
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

    const result = await SendSMS({
      phoneDetails: savedCompany.phoneDetails,
      message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${savedCompany.phoneCode}`,
      forceSendUnconfirmedPhone: true,
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
      data: {
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
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
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      phoneCode: codeConfirmPhone.toUpperCase(),
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": false,
      "phoneDetails.regionalCode": {$ne: null},
    }).select(
      "_id phoneCode phoneDetails.number phoneDetails.isConfirmed companyContact email companyDetails.name companyDetails.nip"
    );

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    // const invoiceExtraSettings = !!findCompany.companyDetails.nip
    //   ? [
    //       {
    //         name: "NIP",
    //         value: findCompany.companyDetails.nip.toString(),
    //       },
    //     ]
    //   : [];

    const newStripeCustomer = await stripe.customers.create({
      address: {
        city: !!findCompany?.companyContact?.city?.placeholder
          ? findCompany?.companyContact?.city?.placeholder
          : "",
        country: findCompany.companyContact.country,
        line1: !!findCompany?.companyContact?.street?.placeholder
          ? findCompany?.companyContact?.street?.placeholder
          : "",
        postal_code: showValidPostalCode(
          findCompany?.companyContact?.postalCode
        ),
      },
      phone: !!findCompany?.phoneDetails?.number
        ? findCompany?.phoneDetails?.number?.toString()
        : undefined,
      name: findCompany.companyDetails.name?.toUpperCase(),
      email: findCompany.email,
      // invoice_settings: {
      //   custom_fields: invoiceExtraSettings,
      // },
      preferred_locales: [findCompany.companyContact.country],
      metadata: {
        companyId: findCompany._id.toString(),
      },
      // tax_id_data: [
      //   {
      //     type: "eu_vat",
      //     value: `${findCompany.companyContact.country}${findCompany.companyDetails.nip}`,
      //   },
      // ],
    });

    if (!!newStripeCustomer) {
      if (!!newStripeCustomer.id) {
        findCompany.stripeCustomerId = newStripeCustomer.id;
      }
    }

    findCompany.phoneCode = null;
    findCompany.phoneDetails.isConfirmed = true;

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: AllTexts?.Company?.[validContentLanguage]?.confirmedPhone,
      data: {
        phoneConfirmed: savedCompany.phoneDetails.isConfirmed,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
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
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": false,
      "phoneDetails.regionalCode": {$ne: null},
    }).select("phoneDetails phoneCode");

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const randomCodePhone = randomString(6);
    findCompany.phoneCode = randomCodePhone.toUpperCase();
    findCompany.phoneDetails.number = newPhone;
    findCompany.phoneDetails.regionalCode = newRegionalCode;
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

    const result = await SendSMS({
      phoneDetails: savedCompany.phoneDetails,
      message: `${AllTexts?.ConfirmPhone?.[validContentLanguage]?.codeToConfirm} ${savedCompany.phoneCode}`,
      forceSendUnconfirmedPhone: true,
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
      message: AllTexts?.Company?.[validContentLanguage]?.confirmedPhone,
      data: {
        number: savedCompany.phoneDetails.number,
        regionalCode: savedCompany.phoneDetails.regionalCode,
        dateSendAgainSMS: savedCompany.phoneDetails.dateSendAgainSMS,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
