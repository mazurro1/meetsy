import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {findValidUserAdminWithPassword, findValidUserAdmin} from "@lib";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";

export const getCompanysAsAdmin = async (
  userEmail: string,
  companyEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserAdmin({
      userEmail: userEmail,
      select: "_id",
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      email: companyEmail,
    });

    if (!!!findCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    const findCompanyWorker = await CompanyWorker.find({
      companyId: findCompany._id,
    }).populate(
      "userId",
      "_id userDetails.name userDetails.surname userDetails.avatarUrl banned"
    );

    if (!!!findCompanyWorker) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        company: findCompany,
        companyWorkers: findCompanyWorker,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const banCompanyAsAdmin = async (
  userEmail: string,
  adminPassword: string,
  companyId: string,
  bannedCompany: boolean,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedAdmin = await findValidUserAdminWithPassword({
      userEmail: userEmail,
      select: "_id password",
      adminPassword: adminPassword,
    });

    if (!!!findedAdmin) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findCompany = await Company.findOne({
      _id: companyId,
    }).select("_id banned");

    if (!!!findCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    findCompany.banned = bannedCompany;

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
      data: {
        banned: savedCompany.banned,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
