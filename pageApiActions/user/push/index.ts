import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import type {UserEndpointKeysProps} from "@/models/User/user.model";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const updateUserPush = async (
  userEmail: string,
  endpoint: string,
  keys: UserEndpointKeysProps,
  expirationTime: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userEmail,
    }).select("email pushEndpoint");
    if (!!findUser) {
      if (!!findUser.pushEndpoint) {
        findUser.pushEndpoint.endpoint = endpoint;
        findUser.pushEndpoint.expirationTime = expirationTime;
        findUser.pushEndpoint.keys.auth = keys.auth;
        findUser.pushEndpoint.keys.p256dh = keys.p256dh;
        const savedUser = await findUser.save();
        if (!!savedUser) {
          return res.status(200).json({
            success: true,
          });
        } else {
          return res.status(501).json({
            success: false,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserPush = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userEmail,
    }).select("email pushEndpoint");
    if (!!findUser) {
      if (!!findUser.pushEndpoint) {
        findUser.pushEndpoint.endpoint = null;
        findUser.pushEndpoint.expirationTime = null;
        findUser.pushEndpoint.keys.auth = null;
        findUser.pushEndpoint.keys.p256dh = null;
        const savedUser = await findUser.save();

        if (!!savedUser) {
          return res.status(200).json({
            success: true,
          });
        } else {
          return res.status(501).json({
            success: false,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
          success: false,
        });
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
