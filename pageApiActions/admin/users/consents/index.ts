import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {findValidUserAdminWithPassword, findValidUser} from "@lib";
import User from "@/models/User/user";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";

export const updateUserConsents = async (
  userEmail: string,
  editedUserEmail: string,
  adminPassword: string,
  consents: number[],
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findedAdmin = await findValidUserAdminWithPassword({
      userEmail: userEmail,
      select: "_id password",
      adminPassword: adminPassword,
    });

    if (!!!findedAdmin) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const findUser = await User.findOne({
      email: editedUserEmail,
    }).select("_id consents");

    if (!!!findUser) {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundAccount,
        success: false,
      });
    }

    if (!!consents) {
      findUser.consents = consents;
    }

    const savedUser = await findUser.save();

    if (!!!savedUser) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        consents: savedUser.consents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
