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
    dateStart: z.string().nullable(),
    dateEnd: z.string().nullable().optional(),
    couponStripeId: z.string(),
    promotionCodeStripeId: z.string(),
  })
  .nullable();

export type CouponProps = z.infer<typeof CouponPropsLive>;
