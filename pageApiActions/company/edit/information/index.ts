import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  findValidCompany,
  UserAlertsGenerator,
} from "@lib";
import Company from "@/models/Company/company";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export const updateCompanyInformation = async (
  userEmail: string,
  companyId: string,
  newName: string,
  newNip: number | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [
          EnumWorkerPermissions.admin,
          EnumWorkerPermissions.manageCompanyInformations,
        ],
      });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await findValidCompany({
      companyId: companyId,
      select: "_id companyDetails.name companyDetails.nip stripeCustomerId",
    });

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    let oldCompanyName: string | null | undefined = null;

    if (findCompany.companyDetails.name !== newName.toLowerCase()) {
      const findCompanyName = await Company.countDocuments({
        "companyDetails.name": newName.toLowerCase(),
      });
      if (!!findCompanyName) {
        return res.status(422).json({
          message:
            AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundCompanyName,
          success: false,
        });
      } else {
        oldCompanyName = findCompany.companyDetails.name;
        findCompany.companyDetails.name = newName.toLowerCase();
      }
    }

    findCompany.companyDetails.nip = newNip;

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!savedCompany?.stripeCustomerId && !!oldCompanyName) {
      if (oldCompanyName !== savedCompany.companyDetails.name) {
        await stripe.customers.update(savedCompany.stripeCustomerId, {
          name: savedCompany.companyDetails.name?.toUpperCase(),
        });
      }
    }

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "CHANGED_COMPANY_INFORMATION",
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
      message: AllTexts?.Company?.[validContentLanguage]?.updatedCompanyProps,
      data: {
        name: savedCompany.companyDetails.name,
        nip: savedCompany.companyDetails.nip,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
