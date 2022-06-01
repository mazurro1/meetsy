import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {findValidQueryCompanys} from "@lib";
import {convertToValidString} from "@functions";

export const getActiveCompanys = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>,
  name: string | undefined,
  city: string | undefined,
  district: string | undefined
) => {
  try {
    const nameQuery = !!name
      ? {"companyDetails.name": {$regex: new RegExp(name, "i")}}
      : {};

    const cityQuery = !!city
      ? {
          "companyContact.city.value": {
            $regex: new RegExp(convertToValidString(city), "i"),
          },
        }
      : {};

    const districtQuery = !!district
      ? {
          "companyContact.district.value": {
            $regex: new RegExp(convertToValidString(district), "i"),
          },
        }
      : {};

    // const sortValid = !!sorts ? sorts : "mostlyRated";
    // const propsSort = !!sortValid
    //   ? sortValid === "aToZ"
    //     ? {name: 1}
    //     : sortValid === "zToA"
    //     ? {name: -1}
    //     : sortValid === "mostlyRated"
    //     ? {opinionsCount: -1}
    //     : sortValid === ""
    //     ? {opinionsValue: -1}
    //     : {}
    //   : {};

    const allCompanys = await findValidQueryCompanys({
      select: "_id companyDetails.name companyDetails.avatarUrl companyContact",
      query: {
        ...nameQuery,
        ...cityQuery,
        ...districtQuery,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        companies: allCompanys,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
