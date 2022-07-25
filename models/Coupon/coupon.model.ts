import {z} from "zod";
import {ProductPropsLive} from "@/models/Product/product.model";

export const PropsProductTuple = ProductPropsLive.or(z.string());

export const CouponPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    name: z.string(),
    products: PropsProductTuple.array(),
    discount: z.number(),
    limit: z.number(),
    isAcitve: z.boolean(),
    isArchived: z.boolean(),
    dateEnd: z.string().nullable().optional(),
    couponStripeId: z.string().nullable(),
    promotionCodeStripeId: z.string().nullable(),
  })
  .nullable();

export type CouponProps = z.infer<typeof CouponPropsLive>;
