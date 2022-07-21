import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {DeleteAWSImage} from "@lib";

export const setUserAvatar = (
  userEmail: string,
  avatarUrl: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    "userDetails.avatarUrl": null,
    banned: false,
  })
    .select("userDetails")
    .then(async (userData) => {
      if (!!userData) {
        userData.userDetails.avatarUrl = avatarUrl;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        return res.status(200).json({
          success: true,
          message: AllTexts?.ImagesAWS?.[validContentLanguage]?.newAvatar,
        });
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    });
};

export const deleteUserAvatar = (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
): any => {
  return User.findOne({
    email: userEmail,
    "userDetails.avatarUrl": {$ne: null},
    banned: false,
  })
    .select("userDetails")
    .then(async (userData) => {
      if (!!userData) {
        if (!!process.env.AWS_PATH_URL) {
          const userAvatarUrl: string = !!userData?.userDetails?.avatarUrl
            ? userData.userDetails.avatarUrl
            : "";
          const isAWSLink = userAvatarUrl.includes(
            process.env.AWS_PATH_URL + "/"
          );
          if (isAWSLink) {
            const [_, avatarFolderLink] = userAvatarUrl.split(
              process.env.AWS_PATH_URL + "/"
            );
            await DeleteAWSImage({imageNameWithFolders: avatarFolderLink});
          }
        }
        userData.userDetails.avatarUrl = null;
        return userData.save();
      } else {
        return null;
      }
    })
    .then(async (userSaved) => {
      if (!!userSaved) {
        return res.status(200).json({
          success: true,
          message: AllTexts?.ImagesAWS?.[validContentLanguage]?.deleteAvatar,
        });
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(501).json({
        success: false,
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      });
    });
};
