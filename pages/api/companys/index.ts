import dbConnect from "@/utils/dbConnect";
import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import {createCompany} from "pageApiActions/company";
import type {LanguagesProps} from "@Texts";
import {z} from "zod";

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<DataProps>) {
  const session = await getSession({req});
  const contentLanguage: LanguagesProps | undefined | string =
    req.headers["content-language"];
  const validContentLanguage: LanguagesProps = !!contentLanguage
    ? contentLanguage === "pl" || contentLanguage === "en"
      ? contentLanguage
      : "pl"
    : "pl";

  if (!session) {
    res.status(401).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  } else if (!session.user!.email) {
    res.status(401).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
      success: false,
    });
    return;
  }

  const {method} = req;
  switch (method) {
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
          postalCode: z.string().nonempty(),
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
            message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
            success: false,
          });
          return;
        }

        await createCompany(
          session.user!.email,
          data.email,
          data.name,
          !!data.nip ? data.nip : null,
          data.postalCode,
          data.city,
          data.district,
          data.street,
          data.phone,
          data.regionalCode,
          validContentLanguage,
          res
        );
      } else {
        res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.invalidInputs,
          success: false,
        });
      }
      return;
    }
    default: {
      res.status(501).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
        success: false,
      });
    }
  }
}
export default handler;
