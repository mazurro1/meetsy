import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidUserAdminWithPassword,
  findValidUser,
  UserAlertsGenerator,
} from "@lib";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";

export const addWorkerToCompanyAsAdmin = async (
  userEmail: string,
  workerEmail: string,
  adminPassword: string,
  companyId: string,
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
    }).select("_id");

    if (!!!findCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    const selectedUserWorker = await findValidUser({
      userEmail: workerEmail,
      select: "_id",
    });

    if (!!!selectedUserWorker) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    const findWorkerInCompany = await CompanyWorker.findOne({
      companyId: companyId,
      userId: selectedUserWorker._id,
    });

    if (!!findWorkerInCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.userIsExisting,
        success: false,
      });
    }

    const newCompanyWorker = new CompanyWorker({
      active: false,
      companyId: companyId,
      permissions: [EnumWorkerPermissions.editAllServices],
      specialization: "",
      userId: selectedUserWorker._id,
    });

    const savedCompanyWorker = await newCompanyWorker.save();

    if (!!!savedCompanyWorker) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const workerPopulate = await savedCompanyWorker.populate(
      "userId",
      "_id userDetails.name userDetails.surname userDetails.avatarUrl"
    );

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "INVITATION_COMPANY_WORKER",
        userId: selectedUserWorker._id,
        companyId: companyId,
        active: true,
      },
      email: null,
      webpush: null,
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    if (!!!workerPopulate) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        newWorker: workerPopulate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const removeWorkerToCompanyAsAdmin = async (
  userEmail: string,
  adminPassword: string,
  companyId: string,
  workerId: string,
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
    }).select("_id");

    if (!!!findCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    const findWorkerInCompany = await CompanyWorker.findOneAndRemove({
      companyId: findCompany._id,
      _id: workerId,
      permissions: {$nin: [EnumWorkerPermissions.admin]},
    }).select("userId");

    // delete all reserwations and services to do

    if (!!!findWorkerInCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: "RED",
        type: "DELETE_COMPANY_WORKER",
        userId: findWorkerInCompany.userId.toString(),
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
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
