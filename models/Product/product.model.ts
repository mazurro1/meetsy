import {z} from "zod";

export const TYPES_OF_METHOD = ["payment", "subscription"] as const;

export const EnumTypeMethod = z.enum(TYPES_OF_METHOD);

export const ProductPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    method: EnumTypeMethod,
    price: z.number(),
    promotion: z.boolean(),
    platformPointsCount: z.number().nullable(),
    platformSubscriptionMonthsCount: z.number().nullable(),
    platformSMSCount: z.number().nullable(),
    stripePriceId: z.string().nullable(),
    stripeProductId: z.string().nullable(),
    reneving: z.number().nullable().optional(),
    dateStart: z.string().nullable(),
    dateEnd: z.string().nullable().optional(),
    isAcitve: z.boolean(),
    isArchived: z.boolean(),
  })
  .nullable();

export type ProductProps = z.infer<typeof ProductPropsLive>;
export type TypeProductMethod = z.infer<typeof EnumTypeMethod>;
