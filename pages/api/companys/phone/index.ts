import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
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
  const session = await getSession({req});
  const contentLanguage: LanguagesProps | undefined | string =
    req.headers["content-language"];
  const contentCompanyId: null | string =
    typeof req.headers["content-companyid"] === "string"
      ? !!req.headers["content-companyid"]
        ? req.headers["content-companyid"]
        : null
      : null;

  const validContentLanguage: LanguagesProps = !!contentLanguage
    ? contentLanguage === "pl" || contentLanguage === "en"
      ? contentLanguage
      : "pl"
    : "pl";

  if (!session) {
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
      success: false,
    });
    return;
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
    //       res.status(422).json({
    //         message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
    //         success: false,
    //       });
    //       return;
    //     }

    //     await updateUserAccounPhone(
    //       session.user!.email,
    //       data.phone,
    //       data.phoneRegionalCode,
    //       validContentLanguage,
    //       res
    //     );
    //   } else {
    //     res.status(422).json({
    //       message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
    //       success: false,
    //     });
    //   }
    //   return;
    // }

    case "GET": {
      if (!!contentCompanyId) {
        await sendAgainCompanyAccounPhoneCode(
          session.user!.email,
          contentCompanyId,
          validContentLanguage,
          res
        );
        return;
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    case "POST": {
      if (!!req.body.codeConfirmPhone && !!contentCompanyId) {
        const DataProps = z.object({
          codeConfirmPhone: z.string(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await confirmCompanyAccounPhoneCode(
          session.user!.email,
          contentCompanyId,
          data.codeConfirmPhone,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    case "PUT": {
      if (
        !!req.body.newPhone &&
        !!req.body.newRegionalCode &&
        !!contentCompanyId
      ) {
        const DataProps = z.object({
          newPhone: z.number(),
          newRegionalCode: z.number(),
        });

        type IDataProps = z.infer<typeof DataProps>;

        const data: IDataProps = req.body;

        const resultData = DataProps.safeParse(data);
        if (!resultData.success) {
          res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
            success: false,
          });
          return;
        }

        await resetPhoneNumberCompany(
          session.user!.email,
          contentCompanyId,
          data.newPhone,
          data.newRegionalCode,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts?.ApiErrors?.[validContentLanguage]?.invalidInputs,
          success: false,
        });
      }
      return;
    }

    default: {
      res.status(501).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
      return;
    }
  }
}
export default handler;
