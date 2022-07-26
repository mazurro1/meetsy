import Product from "@/models/Product/product";
import Coupon from "@/models/Coupon/coupon";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";

export const checkCouponUser = async (
  userEmail: string,
  couponCode: string,
  productId: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findProduct = await Product.findOne({
      isAcitve: true,
      isArchived: false,
      _id: productId,
    });

    if (!!!findProduct) {
      return res.status(422).json({
        success: false,
      });
    }

    const findCoupon = await Coupon.findOne({
      isAcitve: true,
      isArchived: false,
      name: couponCode.toUpperCase(),
      dateEnd: {
        $gte: new Date(),
      },
      products: {
        $in: [findProduct._id?.toString()],
      },
    });

    if (!!!findCoupon) {
      return res.status(422).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        discount: findCoupon.discount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};
