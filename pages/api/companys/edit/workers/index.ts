import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {
  getCompanyWorkers,
  addNewWorkerToCompany,
} from "pageApiActions/company/edit/workers";
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
    case "GET": {
      if (companyId) {
        return await getCompanyWorkers(
          userEmail,
          companyId,
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

    case "POST": {
      if (!!req.body.workerEmail && companyId) {
        const DataProps = z.object({
          workerEmail: z.string(),
          permissions: z.number().array(),
          specialization: z.string().optional(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = {
          workerEmail: req.body.workerEmail,
          permissions: req.body.permissions,
          specialization: req.body.specialization,
        };

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[contentLanguage]?.invalidInputs,
            success: false,
          });
        }

        return await addNewWorkerToCompany(
          userEmail,
          companyId,
          data.workerEmail,
          data.permissions,
          !!data.specialization ? data.specialization : "",
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
