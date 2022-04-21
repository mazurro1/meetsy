import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {updateCompanyEmail} from "pageApiActions/company/edit/email";
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
      if (!!req.body.newEmail && companyId) {
        const DataProps = z.object({
          newEmail: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          newEmail: req.body.newEmail,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await updateCompanyEmail(
          userEmail,
          companyId,
          data.newEmail,
          contentLanguage,
          res
        );
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
