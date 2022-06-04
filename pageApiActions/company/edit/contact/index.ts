import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  getGeolocation,
  findValidCompany,
  UserAlertsGenerator,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
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
      select: "_id companyContact",
    });

    if (!!!findCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
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

    if (
      !!findCompany?.companyContact?.postalCode &&
      !!findCompany?.companyContact?.city?.value &&
      !!findCompany?.companyContact?.street?.value
    ) {
      const resultGeolocation = await getGeolocation({
        adress: `${findCompany.companyContact.postalCode} ${findCompany.companyContact.city.value}, ${findCompany.companyContact.street.value}`,
      });
      findCompany.companyContact.location = resultGeolocation;
    }

    const savedCompany = await findCompany.save();

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
        type: "CHANGED_COMPANY_CONTACT",
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
        companyContact: savedCompany.companyContact,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
