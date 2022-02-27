import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {SendEmail, verifyPassword} from "@lib";

export const getUserAccount = async (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select(
      "email userDetails phoneDetails.has phoneDetails.isConfirmed phoneDetails.number phoneDetails.dateSendAgainSMS phoneDetails.newPhoneIsConfirmed phoneDetails.toConfirmNumber"
    );
    if (!!findUser) {
      return res.status(200).json({
        data: findUser,
        success: true,
      });
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage].ApiErrors.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
    });
  }
};

export const deleteUserAccount = async (
  userErmail: string,
  password: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("email password userDetails.emailIsConfirmed");
    if (!!findUser) {
      let clearToDeleteAccount: boolean = false;

      if (!!findUser.password) {
        const isValidPassword = await verifyPassword(
          password,
          findUser.password
        );
        if (isValidPassword) {
          clearToDeleteAccount = true;
        }
      } else {
        clearToDeleteAccount = true;
      }

      if (!!findUser.userDetails.emailIsConfirmed) {
        await SendEmail({
          userEmail: findUser.email,
          emailTitle: AllTexts[validContentLanguage].AccountApi.accountDeleted,
          emailContent:
            AllTexts[validContentLanguage].AccountApi.accountDeletedText,
        });
      }

      if (clearToDeleteAccount) {
        const result = await findUser.remove();
        if (!!result) {
          return res.status(200).json({
            data: findUser,
            success: true,
            message: AllTexts[validContentLanguage].AccountApi.accountDeleted,
          });
        } else {
          res.status(501).json({
            success: false,
            message:
              AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
          });
        }
      } else {
        return res.status(422).json({
          message: AllTexts[validContentLanguage].ApiErrors.notFoundOrPassword,
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
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage].ApiErrors.somethingWentWrong,
    });
  }
};
