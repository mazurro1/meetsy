import User from "@/models/User/user";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";

interface checkUserIsConfirmedProps {
  userEmail: string;
}

export const checkUserAccountIsConfirmed = async ({
  userEmail = "",
}: checkUserIsConfirmedProps) => {
  try {
    if (!!!userEmail) {
      return false;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
    });

    if (!!!selectedUser) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

interface checkUserAccountIsConfirmedAndHaveCompanyPermissionsProps {
  userEmail: string;
  companyId: string;
  permissions: number[];
}

export const checkUserAccountIsConfirmedAndHaveCompanyPermissions = async ({
  userEmail = "",
  companyId = "",
  permissions = [EnumWorkerPermissions.admin],
}: checkUserAccountIsConfirmedAndHaveCompanyPermissionsProps) => {
  try {
    if (!!!userEmail || !!!companyId || !!!permissions) {
      return false;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
    }).select("_id email");

    if (!!!selectedUser) {
      return false;
    }

    const hasPermissionsInCompany = await CompanyWorker.findOne({
      userId: selectedUser._id,
      companyId: companyId,
      permissions: {$in: permissions},
    }).select("_id");

    if (!!!hasPermissionsInCompany) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
