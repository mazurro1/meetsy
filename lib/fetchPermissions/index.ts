import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import {getSession} from "next-auth/react";
import type {NextApiRequest} from "next";
import type {LanguagesProps} from "@Texts";

interface checkUserIsConfirmedProps {
  userEmail: string;
}

interface findValidUserProps {
  userEmail: string;
  select?: string;
}

export const findValidUser = async ({
  userEmail = "",
  select = "_id -password -emailCode -recoverCode -phoneDetails.code",
}: findValidUserProps) => {
  try {
    if (!!!userEmail) {
      return null;
    }

    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
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
      select: "-password -emailCode -recoverCode -phoneDetails.code",
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
  companyId: string;
  select: string;
}

export const findValidCompany = async ({
  companyId = "",
  select = "_id -emailCode -phoneDetails.code",
}: findValidCompanyProps) => {
  try {
    if (!!!companyId) {
      return null;
    }

    const findCompany = await Company.findOne({
      _id: companyId,
      email: {$ne: null},
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
        return null;
      } else if (!session.user!.email) {
        return null;
      }
    }

    let userEmail: string = "";

    if (enableContentUserEmail) {
      userEmail = !!contentUserEmail ? contentUserEmail : "";
      if (!!!userEmail) {
        if (!!session) {
          if (!!session.user) {
            if (!!session.user.email) {
              userEmail = session.user.email;
            }
          }
        }
      }
    } else {
      if (!!session) {
        if (!!session.user) {
          if (!!session.user.email) {
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
