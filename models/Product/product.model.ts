import {z} from "zod";

export const TYPES_OF_METHOD = ["payment", "subscription"] as const;

export const EnumTypeMethod = z.enum(TYPES_OF_METHOD);

export const ProductPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    method: EnumTypeMethod,
    price: z.number(),
    promotionPrice: z.number().nullable(),
    platformPointsCount: z.number().nullable(),
    platformSubscriptionMonthsCount: z.number().nullable(),
    platformSMSCount: z.number().nullable(),
    stripePriceId: z.string().nullable(),
  })
  .nullable();

export type ProductProps = z.infer<typeof ProductPropsLive>;
export type TypeProductMethod = z.infer<typeof EnumTypeMethod>;
