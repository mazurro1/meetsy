import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {checkCouponUser} from "pageApiActions/coupon";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  let userEmail: string = "";
  let contentLanguage: LanguagesProps = "pl";
  const dataSession = await checkAuthUserSessionAndReturnData(req, true);

  if (!!dataSession) {
    userEmail = dataSession.userEmail;
    contentLanguage = dataSession.contentLanguage;
  } else {
    return res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
      data: {
        status: 401,
      },
    });
  }

  const {method} = req;
  switch (method) {
    case "POST": {
      if (!!req.body.couponCode && !!req.body.productId && !!userEmail) {
        const DataProps = z.object({
          couponCode: z.string(),
          productId: z.string(),
        });
        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await checkCouponUser(
          userEmail,
          data.couponCode,
          data.productId,
          contentLanguage,
          res
        );
      } else {
        return res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
    }

    default: {
      return res.status(501).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
