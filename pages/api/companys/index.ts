import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {createCompany, getUserCompanys} from "pageApiActions/company";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

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
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
    case "GET": {
      await getUserCompanys(userEmail, contentLanguage, res);
      return;
    }

    case "POST": {
      if (
        !!req.body.email &&
        !!req.body.name &&
        !!req.body.postalCode &&
        !!req.body.city &&
        !!req.body.district &&
        !!req.body.street &&
        !!req.body.phone &&
        !!req.body.regionalCode
      ) {
        const DataProps = z.object({
          email: z.string().email().nonempty(),
          name: z.string().nonempty(),
          nip: z.number().optional(),
          postalCode: z.number(),
          city: z.string().nonempty(),
          district: z.string().nonempty(),
          street: z.string().nonempty(),
          phone: z.number(),
          regionalCode: z.number(),
        });
        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await createCompany(
          userEmail,
          data.email,
          data.name,
          !!data.nip ? data.nip : null,
          data.postalCode,
          data.city,
          data.district,
          data.street,
          data.phone,
          data.regionalCode,
          contentLanguage,
          res
        );
        return;
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    default: {
      res.status(501).json({
        message: AllTexts?.ApiErrors?.[contentLanguage]?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
