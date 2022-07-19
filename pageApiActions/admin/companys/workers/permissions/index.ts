import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidUserAdminWithPassword,
  findValidUser,
  UserAlertsGenerator,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnCompanyWorker,
} from "@lib";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";

export const changeComapnyAdmin = async (
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

    const findAdminCompany = await CompanyWorker.findOne({
      companyId: companyId,
      permissions: {$in: [EnumWorkerPermissions.admin]},
    });

    const findWorkerInCompany = await CompanyWorker.findOne({
      companyId: companyId,
      userId: selectedUserWorker._id,
      active: true,
    });

    if (!!!findWorkerInCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const workerHasAdmin = findWorkerInCompany.permissions.some(
      (item) => item === EnumWorkerPermissions.admin
    );

    if (!!workerHasAdmin) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    findWorkerInCompany.permissions = [EnumWorkerPermissions.admin];

    const savedCompanyWorker = await findWorkerInCompany.save();

    if (!!!savedCompanyWorker) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (!!findAdminCompany) {
      findAdminCompany.permissions = [EnumWorkerPermissions.editAllServices];
      await findAdminCompany.save();
      if (!!findAdminCompany.userId) {
        await UserAlertsGenerator({
          data: {
            color: "RED",
            type: "REMOVE_AS_ADMIN",
            userId: findAdminCompany.userId.toString(),
            companyId: companyId,
            active: true,
          },
          email: null,
          webpush: null,
          forceEmail: true,
          forceSocket: true,
          res: res,
        });
      }
    }

    await UserAlertsGenerator({
      data: {
        color: "GREEN",
        type: "SET_AS_ADMIN",
        userId: selectedUserWorker._id.toString(),
        companyId: companyId,
        active: true,
      },
      email: null,
      webpush: null,
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    const findCompanyWorker = await CompanyWorker.find({
      companyId: findCompany._id,
    }).populate(
      "userId",
      "_id userDetails.name userDetails.surname userDetails.avatarUrl email"
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
        workers: findCompanyWorker,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const updateWorkerPermissionsAdmin = async (
  userEmail: string,
  workerEmail: string,
  adminPassword: string,
  permissions: number[],
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
      active: true,
    });

    if (!!!findWorkerInCompany) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const workerHasAdmin = findWorkerInCompany.permissions.some(
      (item) => item === EnumWorkerPermissions.admin
    );

    if (!!workerHasAdmin) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const filterNewPermissions = permissions.filter(
      (item) => item !== EnumWorkerPermissions.admin
    );

    findWorkerInCompany.permissions = filterNewPermissions;

    const savedCompanyWorker = await findWorkerInCompany.save();

    if (!!!savedCompanyWorker) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        workerPermissions: findWorkerInCompany.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
