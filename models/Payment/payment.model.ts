import {z} from "zod";
import {CompanyPropsLive} from "@/models/Company/company.model";
import {ProductPropsLive} from "@/models/Product/product.model";
import {CouponPropsLive} from "@/models/Coupon/coupon.model";

export const PropsCompanyTuple = CompanyPropsLive.or(z.string());
export const PropsProductTuple = ProductPropsLive.or(z.string());
export const PropsCouponTuple = CouponPropsLive.or(z.string());

export const TYPES_OF_STATUS = [
  "unpaid",
  "paid",
  "no_payment_required",
] as const;
export const EnumTypeStatus = z.enum(TYPES_OF_STATUS);

export const PaymentPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    couponId: PropsCouponTuple.nullable(),
    productId: PropsProductTuple,
    companyId: PropsCompanyTuple,
    expiresAt: z.number(),
    stripeCheckoutId: z.string(),
    stripeCheckoutUrl: z.string().nullable(),
    status: EnumTypeStatus,
    invoice: z.string().nullable(),
  })
  .nullable();

export type PaymentProps = z.infer<typeof PaymentPropsLive>;
