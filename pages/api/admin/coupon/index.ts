import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  createCoupon,
  getCouponAdmin,
  updateCoupon,
  deleteCoupon,
} from "pageApiActions/admin/coupon";
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
        !!req.body.userPassword &&
        req.body.isActive !== undefined &&
        req.body.packagesIds !== undefined &&
        req.body.discount !== undefined &&
        req.body.limit !== undefined &&
        !!req.body.dateStart &&
        !!req.body.dateEnd &&
        !!userEmail
      ) {
        const DataProps = z.object({
          userPassword: z.string(),
          name: z.string(),
          packagesIds: z.string().array(),
          discount: z.number(),
          limit: z.number().nullable(),
          isActive: z.boolean(),
          dateStart: z.string(),
          dateEnd: z.string(),
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

        return await createCoupon(
          userEmail,
          data.userPassword,
          data.name,
          data.packagesIds,
          data.discount,
          data.limit,
          data.isActive,
          data.dateStart,
          data.dateEnd,
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

    case "PATCH": {
      if (
        !!req.body._id &&
        !!req.body.userPassword &&
        req.body.isActive !== undefined &&
        !!userEmail
      ) {
        const DataProps = z.object({
          _id: z.string(),
          userPassword: z.string(),
          isActive: z.boolean(),
        });
        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        console.log(resultData);
        if (!resultData.success) {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }
        return await updateCoupon(
          userEmail,
          data._id,
          data.userPassword,
          data.isActive,
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
    case "GET": {
      return await getCouponAdmin(userEmail, contentLanguage, res);
    }
    case "DELETE": {
      if (!!req.body.couponId && !!req.body.userPassword && !!userEmail) {
        const DataProps = z.object({
          couponId: z.string(),
          userPassword: z.string(),
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
        return await deleteCoupon(
          userEmail,
          data.couponId,
          data.userPassword,
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
