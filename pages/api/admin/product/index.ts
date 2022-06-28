import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {createProduct} from "pageApiActions/admin/product";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";
import {EnumTypeMethod} from "@/models/Product/product.model";

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
      if (
        !!req.body.method &&
        !!req.body.price &&
        req.body.stripePriceId !== "undefined" &&
        req.body.promotionPrice !== "undefined" &&
        req.body.platformPointsCount !== "undefined" &&
        req.body.platformSubscriptionMonthsCount !== "undefined" &&
        req.body.platformSMSCount !== "undefined" &&
        !!userEmail
      ) {
        const DataProps = z.object({
          method: EnumTypeMethod,
          price: z.number(),
          promotionPrice: z.number(),
          platformPointsCount: z.number(),
          platformSubscriptionMonthsCount: z.number(),
          platformSMSCount: z.number(),
          stripePriceId: z.string(),
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

        return await createProduct(
          userEmail,
          data.method,
          data.price,
          data.promotionPrice,
          data.platformPointsCount,
          data.platformSubscriptionMonthsCount,
          data.platformSMSCount,
          data.stripePriceId,
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
