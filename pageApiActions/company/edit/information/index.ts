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
import {showValidPostalCode} from "@functions";

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
      select:
        "_id companyDetails stripeCustomerId email phoneDetails companyContact",
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

    if (findCompany.companyDetails.nip !== newNip) {
      findCompany.companyDetails.nip = newNip;
      if (!!newNip) {
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
          preferred_locales: [findCompany.companyContact.country],
          metadata: {
            companyId: findCompany._id.toString(),
          },
          tax_id_data: [
            {
              type: "eu_vat",
              value: `PL${newNip}`,
            },
          ],
        });

        if (!!findCompany?.stripeCustomerId) {
          await stripe.customers.del(findCompany.stripeCustomerId);
        }

        findCompany.stripeCustomerId = newStripeCustomer.id;
      }
    }

    const savedCompany = await findCompany.save();

    if (!!savedCompany?.stripeCustomerId && !!oldCompanyName) {
      if (oldCompanyName !== savedCompany.companyDetails.name) {
        await stripe.customers.update(savedCompany.stripeCustomerId, {
          name: savedCompany.companyDetails.name?.toUpperCase(),
        });
      }
    }

    if (!!!savedCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
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
    console.log(error);
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
