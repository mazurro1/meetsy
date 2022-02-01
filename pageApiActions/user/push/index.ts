import User from "@/models/user";
import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";
import type { UserEndpointKeysProps } from "@/models/user";
import { AllTexts } from "@Texts";
import { LanguagesProps } from "@Texts";

export const updateUserPush = async (
  userErmail: string,
  endpoint: string,
  keys: UserEndpointKeysProps,
  expirationTime: string | null,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("email pushEndpoint");
    if (!!findUser) {
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
        message: AllTexts[validContentLanguage].ApiErrors.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserPush = async (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("email pushEndpoint");
    if (!!findUser) {
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
        message: AllTexts[validContentLanguage].ApiErrors.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
