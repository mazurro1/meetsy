import Company from "@/models/Company/company";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {checkUserAccountIsConfirmedAndHaveCompanyPermissions} from "@lib";

export const getEditCompany = async (
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
        permissions: [
          EnumWorkerPermissions.admin,
          EnumWorkerPermissions.manageCompanyInformations,
        ],
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
      email: {$ne: null},
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
    }).select(
      "_id email companyDetails companyContact phoneDetails.number phoneDetails.has phoneDetails.regionalCode phoneDetails.toConfirmNumber phoneDetails.toConfirmRegionalCode phoneDetails.isConfirmed phoneDetails.dateSendAgainSMS updatedAt createdAt"
    );

    if (!!!findCompany) {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        company: findCompany,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      success: false,
    });
    return;
  }
};
