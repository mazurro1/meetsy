import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import User from "@/models/User/user";

export const setCompanyDefault = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      defaultCompanyId: {$ne: companyId},
      "userDetails.emailIsConfirmed": true,
      "userDetails.hasPassword": true,
      "phoneDetails.number": {$ne: null},
      "phoneDetails.regionalCode": {$ne: null},
      "phoneDetails.isConfirmed": true,
      "phoneDetails.has": true,
    }).select("defaultCompanyId");

    if (!!!selectedUser) {
      return res.status(422).json({
        message:
          AllTexts?.Company?.[validContentLanguage]?.errorSetDefaultCompany,
        success: false,
      });
    }

    selectedUser.defaultCompanyId = companyId;

    const savedUser = await selectedUser.save();

    if (!!!savedUser) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: AllTexts?.Company?.[validContentLanguage]?.setDefaultCompany,
      data: {
        defaultCompanyId: savedUser.defaultCompanyId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
