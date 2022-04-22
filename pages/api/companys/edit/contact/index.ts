import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {updateCompanyContact} from "pageApiActions/company/edit/contact";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";
import {checkAuthUserSessionAndReturnData} from "@lib";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  let companyId: string | null = "";
  let userEmail: string = "";
  let contentLanguage: LanguagesProps = "pl";
  const dataSession = await checkAuthUserSessionAndReturnData(req);
  if (!!dataSession) {
    companyId = dataSession.companyId;
    userEmail = dataSession.userEmail;
    contentLanguage = dataSession.contentLanguage;
  } else {
    return res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
    });
  }

  const {method} = req;
  switch (method) {
    case "PATCH": {
      if (
        !!req.body.postalCode &&
        !!req.body.city &&
        !!req.body.district &&
        !!req.body.street &&
        companyId
      ) {
        const DataProps = z.object({
          postalCode: z.number(),
          city: z.string(),
          district: z.string(),
          street: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          postalCode: req.body.postalCode,
          city: req.body.city,
          district: req.body.district,
          street: req.body.street,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await updateCompanyContact(
          userEmail,
          companyId,
          data.postalCode,
          data.city,
          data.district,
          data.street,
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
