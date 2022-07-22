import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  createProduct,
  getProductsAdmin,
  updateProduct,
  deleteProduct,
} from "pageApiActions/admin/product";
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
        !!req.body.userPassword &&
        !!req.body.name &&
        !!req.body.description &&
        req.body.price !== undefined &&
        req.body.isActive !== undefined &&
        req.body.points !== undefined &&
        req.body.premium !== undefined &&
        req.body.sms !== undefined &&
        req.body.promotion !== undefined &&
        !!req.body.dateStart &&
        !!userEmail
      ) {
        const DataProps = z.object({
          method: EnumTypeMethod,
          userPassword: z.string(),
          name: z.string(),
          description: z.string(),
          reneving: z.number().optional(),
          price: z.number(),
          promotion: z.boolean(),
          isActive: z.boolean(),
          points: z.number(),
          premium: z.number(),
          sms: z.number(),
          dateStart: z.string(),
          dateEnd: z.string().nullable(),
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
          data.userPassword,
          data.name,
          data.description,
          !!data.reneving ? data.reneving : null,
          data.price,
          data.points,
          data.premium,
          data.sms,
          data.promotion,
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
        !!req.body.name &&
        !!req.body.description &&
        req.body.isActive !== undefined &&
        req.body.points !== undefined &&
        req.body.premium !== undefined &&
        req.body.sms !== undefined &&
        req.body.promotion !== undefined &&
        !!req.body.dateStart &&
        !!userEmail
      ) {
        const DataProps = z.object({
          _id: z.string(),
          userPassword: z.string(),
          name: z.string(),
          description: z.string(),
          reneving: z.number().optional(),
          promotion: z.boolean(),
          isActive: z.boolean(),
          points: z.number(),
          premium: z.number(),
          sms: z.number(),
          dateStart: z.string(),
          dateEnd: z.string().nullable(),
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

        return await updateProduct(
          userEmail,
          data._id,
          data.userPassword,
          data.name,
          data.description,
          !!data.reneving ? data.reneving : null,
          data.points,
          data.premium,
          data.sms,
          data.promotion,
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
    case "GET": {
      return await getProductsAdmin(userEmail, contentLanguage, res);
    }
    case "DELETE": {
      if (!!req.body.productId && !!req.body.userPassword && !!userEmail) {
        const DataProps = z.object({
          productId: z.string(),
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
        return await deleteProduct(
          userEmail,
          data.productId,
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
