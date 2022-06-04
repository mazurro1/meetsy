import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {
  findValidQueryCompanys,
  findValidCompany,
  getGeolocation,
  findValidQueryCompanysAll,
} from "@lib";
import {convertToValidString} from "@functions";

export const getActiveCompanys = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>,
  name: string | undefined,
  city: string | undefined,
  district: string | undefined,
  sort: number = 1,
  page: number = 1
) => {
  try {
    const nameQuery = !!name
      ? {"companyDetails.name": {$regex: new RegExp(name, "i")}}
      : {};

    const cityQuery = !!city
      ? {
          "companyContact.city.value": convertToValidString(city),
        }
      : {};

    const districtQuery = !!district
      ? {
          "companyContact.district.value": {
            $regex: new RegExp(convertToValidString(district), "i"),
          },
        }
      : {};

    const sortQuery =
      sort === 1
        ? {"companyDetails.name": 1}
        : sort === 2
        ? {"companyDetails.name": -1}
        : // : sort === 3
          // ? {opinionsCount: -1}
          // : sort === 4
          // ? {opinionsValue: -1}
          {};

    const allCompanys = await findValidQueryCompanys({
      select: "_id companyDetails.name companyDetails.avatarUrl companyContact",
      query: {
        ...nameQuery,
        ...cityQuery,
        ...districtQuery,
      },
      sort: sortQuery,
      page: page,
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

export const getSelectedCompany = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>,
  companyUrl: string
) => {
  try {
    const findedCompany = await findValidCompany({
      companyId: null,
      select:
        "companyDetails.name companyDetails.nip companyDetails.images companyContact phoneDetails.number phoneDetails.regionalCode phoneDetails.has phoneDetails.isConfirmed createdAt",
      query: {
        "companyContact.url": companyUrl,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        company: findedCompany,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const getActiveCompanysMap = async (
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
          "companyContact.city.value": convertToValidString(city),
        }
      : {};

    const districtQuery = !!district
      ? {
          "companyContact.district.value": {
            $regex: new RegExp(convertToValidString(district), "i"),
          },
        }
      : {};

    const allCompanys = await findValidQueryCompanysAll({
      select: "_id companyDetails.name companyDetails.avatarUrl companyContact",
      query: {
        ...nameQuery,
        ...cityQuery,
        ...districtQuery,
      },
    });

    const resultGeolocation = await getGeolocation({
      adress: convertToValidString(!!city ? city : "polska"),
    });

    return res.status(200).json({
      success: true,
      data: {
        companies: allCompanys,
        location: resultGeolocation,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
