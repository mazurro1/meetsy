import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {findValidUser, UserAlertsGenerator} from "@lib";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";

export const getUserInvitations = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser = await findValidUser({
      userEmail: userEmail,
    });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const allInvitations = await CompanyWorker.find({
      userId: selectedUser._id,
      active: false,
    }).populate("companyId", "companyDetails.name companyContact");

    if (!allInvitations) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        invitations: allInvitations,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const deleteUserInvitations = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser = await findValidUser({
      userEmail: userEmail,
    });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const deleteInvitations = await CompanyWorker.findOneAndRemove({
      userId: selectedUser._id,
      companyId: companyId,
      active: false,
    });

    if (!!!deleteInvitations) {
      return res.status(401).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: "RED",
        type: "INVITATION_COMPANY_WORKER_CANCELED",
        userId: selectedUser._id,
        companyId: companyId,
        active: true,
      },
      email: null,
      webpush: null,
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const acceptUserInvitations = async (
  userEmail: string,
  companyId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const selectedUser = await findValidUser({
      userEmail: userEmail,
    });

    if (!selectedUser) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.noAccess,
        success: false,
      });
    }

    const selectedInvitations = await CompanyWorker.findOne({
      userId: selectedUser._id,
      companyId: companyId,
      active: false,
    }).select("_id active");

    if (!!!selectedInvitations) {
      return res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    selectedInvitations.active = true;

    const savedInvitations = await selectedInvitations.save();

    if (!!!savedInvitations) {
      return res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    await UserAlertsGenerator({
      data: {
        color: "SECOND",
        type: "INVITATION_COMPANY_WORKER_ACCEPTED",
        userId: selectedUser._id,
        companyId: companyId,
        active: true,
      },
      email: null,
      webpush: null,
      forceEmail: true,
      forceSocket: true,
      res: res,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
