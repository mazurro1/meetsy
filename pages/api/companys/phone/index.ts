import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {checkAuthUserSessionAndReturnData} from "@lib";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  sendAgainCompanyAccounPhoneCode,
  confirmCompanyAccounPhoneCode,
  resetPhoneNumberCompany,
} from "pageApiActions/company/phone";
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
    return res.status(401).json({
      message: AllTexts?.ApiErrors?.[contentLanguage]?.noAccess,
      success: false,
    });
  }

  const {method} = req;
  switch (method) {
    // case "PATCH": {
    //   if (!!req.body.phone && !!req.body.phoneRegionalCode) {
    //     const DataProps = z.object({
    //       phone: z.number(),
    //       phoneRegionalCode: z.number(),
    //     });

    //     type IDataProps = z.infer<typeof DataProps>;

    //     const data: IDataProps = req.body;

    //     const resultData = DataProps.safeParse(data);
    //     if (!resultData.success) {
    //       return res.status(422).json({
    //         message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
    //         success: false,
    //       });
    //     }

    //     return await updateUserAccounPhone(
    //       session.user!.email,
    //       data.phone,
    //       data.phoneRegionalCode,
    //       validContentLanguage,
    //       res
    //     );
    //   } else {
    //     return res.status(422).json({
    //       message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
    //       success: false,
    //     });
    //   }
    // }

    case "GET": {
      if (!!companyId) {
        return await sendAgainCompanyAccounPhoneCode(
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
      if (!!req.body.codeConfirmPhone && !!companyId) {
        const DataProps = z.object({
          codeConfirmPhone: z.string(),
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

        return await confirmCompanyAccounPhoneCode(
          userEmail,
          companyId,
          data.codeConfirmPhone,
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

    case "PUT": {
      if (!!req.body.newPhone && !!req.body.newRegionalCode && !!companyId) {
        const DataProps = z.object({
          newPhone: z.number(),
          newRegionalCode: z.number(),
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

        return await resetPhoneNumberCompany(
          userEmail,
          companyId,
          data.newPhone,
          data.newRegionalCode,
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
