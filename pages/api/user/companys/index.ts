import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {getActiveCompanys} from "pageApiActions/user/companys";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  let contentLanguage: LanguagesProps = "pl";
  const dataSession = await checkAuthUserSessionAndReturnData(req, true);
  if (!!dataSession) {
    contentLanguage = dataSession.contentLanguage;
  }

  const {method} = req;
  switch (method) {
    case "POST": {
      if (
        req.body.name !== "undefined" &&
        req.body.city !== "undefined" &&
        req.body.district !== "undefined" &&
        req.body.sort !== "undefined" &&
        req.body.page !== "undefined"
      ) {
        const DataProps = z.object({
          name: z.string().optional(),
          city: z.string().optional(),
          district: z.string().optional(),
          sort: z.number().optional(),
          page: z.number().optional(),
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

        return await getActiveCompanys(
          contentLanguage,
          res,
          data.name,
          data.city,
          data.district,
          data.sort,
          data.page
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
