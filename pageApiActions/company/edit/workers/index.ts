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
import {sortArray, compareAllItems} from "@functions";

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

    sortArray(filterPermissions);

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

export const deleteWorkerFromCompany = async (
  userEmail: string,
  companyId: string,
  workerId: string,
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

    if (!!!accessUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const selectedWorkerInCompany = await CompanyWorker.findOneAndDelete({
      companyId: companyId,
      _id: workerId,
      permissions: {
        $nin: [EnumWorkerPermissions.admin],
      },
    });

    if (!!!selectedWorkerInCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    if (typeof selectedWorkerInCompany.userId === "string") {
      await UserAlertsGenerator({
        data: {
          color: "RED",
          type: selectedWorkerInCompany.active
            ? "DELETE_COMPANY_WORKER"
            : "DELETE_INVITATION_COMPANY_WORKER",
          userId: selectedWorkerInCompany.userId,
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

    await UserAlertsGenerator({
      data: {
        color: "RED",
        type: selectedWorkerInCompany.active
          ? "DELETED_COMPANY_WORKER"
          : "DELETED_INVITATION_COMPANY_WORKER",
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
      message: selectedWorkerInCompany.active
        ? AllTexts?.CompanyWorker?.[validContentLanguage]
            ?.deleteWorkerFromCompany
        : AllTexts?.CompanyWorker?.[validContentLanguage]
            ?.deleteInvitationWorker,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const editWorkerCompany = async (
  userEmail: string,
  companyId: string,
  workerId: string,
  workerPermissions: number[] | null,
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

    const selectedWorkerCompany = await CompanyWorker.findOne({
      companyId: companyId,
      _id: workerId,
    }).select("_id permissions specialization");

    if (!!!selectedWorkerCompany) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    let workerIsAdmin: boolean = false;

    workerIsAdmin = selectedWorkerCompany.permissions.some((itemPermission) => {
      return itemPermission === EnumWorkerPermissions.admin;
    });

    let filterPermissions: number[] = [];
    if (!!workerPermissions) {
      filterPermissions = workerPermissions.filter(
        (item) => item !== EnumWorkerPermissions.admin
      );
    }

    sortArray(filterPermissions);
    sortArray(selectedWorkerCompany.permissions);

    const isTheSamePermissions: boolean = compareAllItems(
      selectedWorkerCompany.permissions,
      filterPermissions
    );

    const isTheSameSpecialization: boolean = compareAllItems(
      selectedWorkerCompany.specialization,
      workerSpecialization
    );

    if (isTheSamePermissions && isTheSameSpecialization) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
        success: false,
      });
    }
    if (!isTheSamePermissions && !workerIsAdmin) {
      selectedWorkerCompany.permissions = filterPermissions;
    }

    if (!isTheSameSpecialization) {
      selectedWorkerCompany.specialization = workerSpecialization;
    }

    const savedCompanyWorker = await selectedWorkerCompany.save();

    if (!!!savedCompanyWorker) {
      return res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "EDITED_COMPANY_WORKER",
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
      message: AllTexts?.CompanyWorker?.[validContentLanguage]?.endEditWorker,
      data: {
        permissions: savedCompanyWorker.permissions,
        specialization: savedCompanyWorker.specialization,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
