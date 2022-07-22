import Product from "@/models/Product/product";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {TYPES_OF_METHOD} from "@/models/Product/product.model";

export const getProducts = async (
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const allProducts = await Product.find({
      isAcitve: true,
      isArchived: false,
      method: {$in: TYPES_OF_METHOD},
    }).limit(100);

    if (!!!allProducts) {
      return res.status(422).json({
        message:
          AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        products: allProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
