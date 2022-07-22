import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import {getSession} from "next-auth/react";
import type {NextApiRequest} from "next";
import type {LanguagesProps} from "@Texts";
import {EnumUserPermissions} from "@/models/User/user.model";
import {verifyPassword} from "@lib";

interface checkUserIsConfirmedProps {
  userEmail: string;
}

interface findValidUserProps {
  userEmail: string;
  select?: string;
}

interface findValidUserAdminProps {
  userEmail: string;
  select?: string;
  adminPassword: string;
}

export const findValidUser = async ({
  userEmail = "",
  select = "_id -password -emailCode -recoverCode -phoneCode",
}: findValidUserProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      banned: false,
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
    }).select(select);

    if (!!!selectedUser) {
      return null;
    }

    return selectedUser;
  } catch (err) {
    return null;
  }
};

export const findValidUserAdmin = async ({
  userEmail = "",
  select = "_id -password -emailCode -recoverCode -phoneCode",
}: findValidUserProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      banned: false,
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
      permissions: {
        $in: [EnumUserPermissions.admin, EnumUserPermissions.superAdmin],
      },
    }).select(select);

    if (!!!selectedUser) {
      return null;
    }

    return selectedUser;
  } catch (err) {
    return null;
  }
};

export const findValidUserSuperAdmin = async ({
  userEmail = "",
  select = "_id -password -emailCode -recoverCode -phoneCode",
}: findValidUserProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      banned: false,
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
      permissions: {
        $in: [EnumUserPermissions.superAdmin],
      },
    }).select(select);

    if (!!!selectedUser) {
      return null;
    }

    return selectedUser;
  } catch (err) {
    return null;
  }
};

export const findValidUserSuperAdminWithPassword = async ({
  userEmail = "",
  select = "_id -emailCode -recoverCode -phoneCode",
  adminPassword = "",
}: findValidUserAdminProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      banned: false,
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
      permissions: {
        $in: [EnumUserPermissions.superAdmin],
      },
    }).select(select);

    if (!!!selectedUser?.password) {
      return null;
    }

    const isValidPassword = await verifyPassword(
      adminPassword,
      selectedUser.password
    );

    if (!isValidPassword) {
      return null;
    }

    if (!!!selectedUser) {
      return null;
    }

    return selectedUser;
  } catch (err) {
    return null;
  }
};

export const findValidUserAdminWithPassword = async ({
  userEmail = "",
  select = "_id -emailCode -recoverCode -phoneCode",
  adminPassword = "",
}: findValidUserAdminProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      banned: false,
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
      permissions: {
        $in: [EnumUserPermissions.admin, EnumUserPermissions.superAdmin],
      },
    }).select(select);

    if (!!!selectedUser?.password) {
      return null;
    }

    const isValidPassword = await verifyPassword(
      adminPassword,
      selectedUser.password
    );

    if (!isValidPassword) {
      return null;
    }

    if (!!!selectedUser) {
      return null;
    }

    return selectedUser;
  } catch (err) {
    return null;
  }
};

export const checkUserAccountIsConfirmed = async ({
  userEmail = "",
}: checkUserIsConfirmedProps) => {
  try {
    if (!!!userEmail) {
      return false;
    }

    const findedUser = await findValidUser({
      userEmail: userEmail,
    });

    if (!!!findedUser) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const checkUserAccountIsConfirmedAndReturnUser = async ({
  userEmail = "",
}: checkUserIsConfirmedProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const findedUser = await findValidUser({
      userEmail: userEmail,
      select: "-password -emailCode -recoverCode -phoneCode",
    });

    if (!!!findedUser) {
      return null;
    }

    return findedUser;
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

    const selectedUser = await findValidUser({
      userEmail: userEmail,
    });

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

interface checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUserProps {
  userEmail: string;
  companyId: string;
  permissions: number[];
  select?: string;
}

export const checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser =
  async ({
    userEmail = "",
    companyId = "",
    permissions = [EnumWorkerPermissions.admin],
    select = "_id -password -emailCode -recoverCode -password -phoneCode",
  }: checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUserProps) => {
    try {
      if (!!!userEmail || !!!companyId || !!!permissions) {
        return false;
      }

      const selectedUser = await findValidUser({
        userEmail: userEmail,
        select: select,
      });

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

      return selectedUser;
    } catch (err) {
      return false;
    }
  };

export const checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnCompanyWorker =
  async ({
    userEmail = "",
    companyId = "",
    permissions = [EnumWorkerPermissions.admin],
  }: checkUserAccountIsConfirmedAndHaveCompanyPermissionsProps) => {
    try {
      if (!!!userEmail || !!!companyId || !!!permissions) {
        return false;
      }

      const selectedUser = await findValidUser({
        userEmail: userEmail,
      });

      if (!!!selectedUser) {
        return false;
      }

      const hasPermissionsInCompany = await CompanyWorker.findOne({
        userId: selectedUser._id,
        companyId: companyId,
        permissions: {$in: permissions},
      });

      if (!!!hasPermissionsInCompany) {
        return false;
      }

      return hasPermissionsInCompany;
    } catch (err) {
      return false;
    }
  };

interface findValidCompanyProps {
  companyId: string | null;
  select: string;
  query?: object | null;
}

export const findValidCompany = async ({
  companyId = "",
  select = "_id -emailCode -phoneCode",
  query = null,
}: findValidCompanyProps) => {
  try {
    if (!!!companyId && !!!query) {
      return null;
    }

    const selectQueryOrId = !!companyId
      ? {_id: companyId}
      : !!query
      ? query
      : null;

    if (!!!selectQueryOrId) {
      return null;
    }

    const findCompany = await Company.findOne({
      ...selectQueryOrId,
      email: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
    }).select(select);

    if (!!!findCompany) {
      return null;
    }

    return findCompany;
  } catch (err) {
    return null;
  }
};

interface findValidQueryCompanysProps {
  query: object;
  select: string;
  sort: object;
  page: number;
  limit?: number;
}

export const findValidQueryCompanys = async ({
  select = "_id -emailCode -phoneCode",
  query = {_id: null},
  sort = {},
  page = 1,
  limit = 10,
}: findValidQueryCompanysProps) => {
  try {
    if (!!!query || !!!page) {
      return [];
    }

    const findCompany = await Company.find({
      ...query,
      email: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
    })
      .select(select)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return findCompany;
  } catch (err) {
    return null;
  }
};

interface findValidQueryCompanysAllProps {
  query: object;
  select: string;
}

export const findValidQueryCompanysAll = async ({
  select = "_id -emailCode -phoneCode",
  query = {_id: null},
}: findValidQueryCompanysAllProps) => {
  try {
    if (!!!query) {
      return [];
    }

    const findCompany = await Company.find({
      ...query,
      email: {$ne: null},
      banned: false,
      "phoneDetails.has": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.regionalCode": {$ne: null},
      "companyDetails.emailIsConfirmed": true,
    })
      .select(select)
      .limit(500);

    return findCompany;
  } catch (err) {
    return null;
  }
};

interface checkAuthUserSessionAndReturnDataPropsReturnData {
  userEmail: string;
  companyId: string | null;
  contentLanguage: LanguagesProps;
}

export const checkAuthUserSessionAndReturnData = async (
  req: NextApiRequest,
  enableContentUserEmail: boolean = false
) => {
  try {
    if (!!!req) {
      return null;
    }

    const session = await getSession({req});
    const contentLanguage: LanguagesProps | undefined | string =
      req.headers["content-language"];
    const contentCompanyId: null | string =
      typeof req.headers["content-companyid"] === "string"
        ? !!req.headers["content-companyid"]
          ? req.headers["content-companyid"]
          : null
        : null;

    const contentUserEmail: null | string =
      typeof req.headers["content-useremail"] === "string"
        ? !!req.headers["content-useremail"]
          ? req.headers["content-useremail"]
          : null
        : null;

    const validContentLanguage: LanguagesProps = !!contentLanguage
      ? contentLanguage === "pl" || contentLanguage === "en"
        ? contentLanguage
        : "pl"
      : "pl";

    if (!enableContentUserEmail) {
      if (!session) {
        return session;
      } else if (!session.user!.email) {
        return null;
      }
    }

    let userEmail: string = "";

    if (enableContentUserEmail) {
      userEmail = !!contentUserEmail ? contentUserEmail : "";
      if (!!!userEmail) {
        if (!!session) {
          if (!!session?.user) {
            if (!!session?.user?.email) {
              userEmail = session.user.email;
            }
          }
        }
      }
    } else {
      if (!!session) {
        if (!!session?.user) {
          if (!!session?.user?.email) {
            userEmail = session.user.email;
          }
        }
      }
    }

    if (!!!userEmail) {
      return null;
    }

    const data: checkAuthUserSessionAndReturnDataPropsReturnData = {
      userEmail: userEmail,
      companyId: contentCompanyId,
      contentLanguage: validContentLanguage,
    };

    return data;
  } catch (err) {
    return null;
  }
};
