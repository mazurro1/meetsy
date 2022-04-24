import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  findValidUser,
  UserAlertsGenerator,
} from "@lib";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";

const populateUserValue =
  "_id userDetails.name userDetails.surname userDetails.avatarUrl";

export const getCompanyWorkers = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissions({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [
          EnumWorkerPermissions.admin,
          EnumWorkerPermissions.manageWorkers,
        ],
      });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const allCompanyWorkers = await CompanyWorker.find({
      companyId: companyId,
    }).populate("userId", populateUserValue);

    if (!allCompanyWorkers) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        workers: allCompanyWorkers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const addNewWorkerToCompany = async (
  userEmail: string,
  companyId: string,
  workerEmail: string,
  workerPermissions: number[],
  workerSpecialization: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const accessUser =
      await checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser({
        userEmail: userEmail,
        companyId: companyId,
        permissions: [
          EnumWorkerPermissions.admin,
          EnumWorkerPermissions.manageWorkers,
        ],
      });

    if (!accessUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const selectedUserWorker = await findValidUser({
      userEmail: workerEmail,
      select: "_id",
    });

    if (!!!selectedUserWorker) {
      return res.status(401).json({
        message:
          AllTexts?.CompanyWorker?.[validContentLanguage]?.workerNoInPlatform,
        success: false,
      });
    }

    const isUserInCompany = await CompanyWorker.countDocuments({
      companyId: companyId,
      userId: selectedUserWorker._id,
    });

    if (!!isUserInCompany) {
      return res.status(401).json({
        message:
          AllTexts?.CompanyWorker?.[validContentLanguage]?.workerInCompany,
        success: false,
      });
    }

    const filterPermissions = workerPermissions.filter(
      (item) => item !== EnumWorkerPermissions.admin
    );

    const newCompanyWorker = new CompanyWorker({
      active: false,
      companyId: companyId,
      permissions: filterPermissions,
      specialization: workerSpecialization,
      userId: selectedUserWorker._id,
    });

    const savedCompanyWorker = await newCompanyWorker.save();

    if (!!!savedCompanyWorker) {
      return res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    const populateCompanyWorker = await savedCompanyWorker.populate(
      "userId",
      populateUserValue
    );

    if (!!!populateCompanyWorker) {
      return res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

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

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "SENDED_INVITATION_COMPANY_WORKER",
        userId: accessUser._id,
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
      message:
        AllTexts?.CompanyWorker?.[validContentLanguage]?.workerSendInvation,
      data: {
        newCompanyWorker: populateCompanyWorker,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
