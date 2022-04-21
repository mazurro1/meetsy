import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  findValidCompany,
} from "@lib";
import {convertToValidString} from "@functions";

export const updateCompanyContact = async (
  userEmail: string,
  companyId: string,
  postalCode: number,
  city: string,
  district: string,
  street: string,
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
      res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await findValidCompany({
      companyId: companyId,
      select: "_id companyContact",
    });

    if (!!!findCompany) {
      res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }

    if (findCompany.companyContact.postalCode !== postalCode) {
      findCompany.companyContact.postalCode = postalCode;
    }
    if (findCompany.companyContact.city.placeholder !== city) {
      findCompany.companyContact.city = {
        placeholder: city,
        value: convertToValidString(city),
      };
    }

    if (findCompany.companyContact.district.placeholder !== district) {
      findCompany.companyContact.district = {
        placeholder: district,
        value: convertToValidString(district),
      };
    }

    if (findCompany.companyContact.street.placeholder !== street) {
      findCompany.companyContact.street = {
        placeholder: street,
        value: convertToValidString(street),
      };
    }

    const savedCompany = await findCompany.save();

    if (!!!savedCompany) {
      res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: AllTexts?.Company?.[validContentLanguage]?.updatedCompanyProps,
      data: {
        companyContact: savedCompany.companyContact,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
    return;
  }
};
