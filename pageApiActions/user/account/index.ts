import User from "@/models/user";
import type { NextApiResponse } from "next";
import type { DataProps } from "@/utils/type";
import { AllTexts } from "@Texts";
import { LanguagesProps } from "@Texts";

export const getUserAccount = async (
  userErmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("email userDetails phoneDetails.has phoneDetails.isConfirmed");
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
    console.log(error);
  }
};
