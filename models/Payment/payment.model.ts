import {z} from "zod";
import {CompanyPropsLive} from "@/models/Company/company.model";
import {ProductPropsLive} from "@/models/Product/product.model";
import {CouponPropsLive} from "@/models/Coupon/coupon.model";
import {UserPropsOnlyNameSurnameUrlLive} from "@/models/User/user.model";

export const PropsCompanyTuple = CompanyPropsLive.or(z.string());
export const PropsProductTuple = ProductPropsLive.or(z.string());
export const PropsCouponTuple = CouponPropsLive.or(z.string());
export const PropsUserTuple = UserPropsOnlyNameSurnameUrlLive.or(z.string());

export const TYPES_OF_STATUS = [
  "unpaid",
  "paid",
  "no_payment_required",
  "failure_payment",
  "draft",
] as const;
export const EnumTypeStatus = z.enum(TYPES_OF_STATUS);

export const StatusProps = z.object({
  value: EnumTypeStatus,
  date: z.string(),
});

export const InvoicesProps = z.object({
  url: z.string(),
  date: z.string(),
});

export const PaymentPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    couponId: PropsCouponTuple.nullable(),
    productId: PropsProductTuple,
    companyId: PropsCompanyTuple,
    userId: PropsUserTuple,
    expiresAt: z.number(),
    stripeCheckoutId: z.string().nullable(),
    stripeCheckoutUrl: z.string().nullable(),
    stripePaymentIntentId: z.string().nullable(),
    stripeSubscriptionId: z.string().nullable(),
    stripeLinkInvoice: InvoicesProps.array(),
    status: StatusProps.array(),
  })
  .nullable();

export type PaymentProps = z.infer<typeof PaymentPropsLive>;
