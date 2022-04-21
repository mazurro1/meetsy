import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  findValidCompany,
  randomString,
  SendEmail,
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
      res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
      return;
    }

    const findCompany = await findValidCompany({
      companyId: companyId,
      select: "_id email companyDetails.toConfirmEmail emailCode",
    });

    if (!!!findCompany) {
      res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
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
    findCompany.emailCode = randomCodeEmail;
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
      res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
      return;
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
    res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
    return;
  }
};
