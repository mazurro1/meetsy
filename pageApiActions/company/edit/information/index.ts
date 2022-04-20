import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  findValidCompany,
} from "@lib";
import Company from "@/models/Company/company";

export const updateCompanyInformation = async (
  userEmail: string,
  companyId: string,
  newName: string,
  newNip: number | null,
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
      select: "_id companyDetails.name companyDetails.nip",
    });

    if (!!!findCompany) {
      res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }

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
        findCompany.companyDetails.name = newName.toLowerCase();
      }
    }

    findCompany.companyDetails.nip = newNip;

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
        name: savedCompany.companyDetails.name,
        nip: savedCompany.companyDetails.nip,
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
