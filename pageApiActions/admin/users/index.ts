import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidUserAdmin,
  findValidUserAdminWithPassword,
  UserAlertsGenerator,
} from "@lib";
import User from "@/models/User/user";

export const getUserAsAdmin = async (
  userEmail: string,
  searchedUserEmail: string,
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

    const findUser = await User.findOne({
      email: searchedUserEmail,
    }).select("-password -recoverCode -emailCode -phoneCode");

    if (!!!findUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: findUser,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const banUserAsAdmin = async (
  userEmail: string,
  adminPassword: string,
  bannedUserEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedUser = await findValidUserAdminWithPassword({
      userEmail: userEmail,
      adminPassword: adminPassword,
    });

    if (!!!findedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findUser = await User.findOne({
      email: bannedUserEmail,
    }).select("_id email banned");

    if (!!!findUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    findUser.banned = !findUser.banned;

    const savedUser = await findUser.save();

    if (!!!savedUser) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: savedUser.banned ? "RED" : "GREEN",
        type: savedUser.banned ? "BANED_USER" : "UNBANED_USER",
        userId: savedUser._id.toString(),
        active: true,
      },
      email: {
        title: savedUser.banned
          ? AllTexts?.AdminUser?.[validContentLanguage]?.banedUserTitle
          : AllTexts?.AdminUser?.[validContentLanguage]?.unBanedUserTitle,
        body: `${
          savedUser.banned
            ? AllTexts?.AdminUser?.[validContentLanguage]?.banedUserContent
            : AllTexts?.AdminUser?.[validContentLanguage]?.unBanedUserContent
        }`,
      },
      webpush: {
        title: savedUser.banned
          ? AllTexts?.AdminUser?.[validContentLanguage]?.banedUserTitle
          : AllTexts?.AdminUser?.[validContentLanguage]?.unBanedUserTitle,
        body: `${
          savedUser.banned
            ? AllTexts?.AdminUser?.[validContentLanguage]?.banedUserContent
            : AllTexts?.AdminUser?.[validContentLanguage]?.unBanedUserContent
        }`,
      },
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    return res.status(200).json({
      success: true,
      data: {
        banned: savedUser.banned,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
