import User from "@/models/User/user";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import Alert from "@/models/Alert/alert";

export const getUserAlerts = async (
  userErmail: string,
  page: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await User.findOne({
      email: userErmail,
    }).select("_id");

    if (!!findUser) {
      const alertsToDownload: number = 10;

      const allAlerts = await Alert.find({
        userId: findUser._id,
      })
        .sort({createdAt: -1})
        .skip(page * alertsToDownload)
        .limit(alertsToDownload)
        .select("-userId");

      if (!!allAlerts) {
        res.status(200).json({
          success: true,
          data: {
            alerts: allAlerts.length > 0 ? allAlerts : null,
          },
        });
      } else {
        res.status(501).json({
          success: false,
          message:
            AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        });
      }
    } else {
      res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundAccount,
        success: false,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};
