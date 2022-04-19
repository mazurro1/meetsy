import {z} from "zod";
import {UserPropsLive} from "../User/user.model";
import {CompanyPropsLive} from "@/models/Company/company.model";

const ALERT_COLORS_VALUES = [
  "PRIMARY",
  "SECOND",
  "RED",
  "GREEN",
  "GREY",
] as const;
const ALERT_TYPE_VALUES = [
  "CHANGED_PASSWORD",
  "CHANGED_EMAIL",
  "CHANGED_CONSENTS",
  "CHANGED_PHONE_NUMBER",
  "CHANGED_ACCOUNT_PROPS",
  "CREATED_COMPANY",
] as const;

export const EnumAlertType = z.enum(ALERT_TYPE_VALUES);
export const EnumAlertColor = z.enum(ALERT_COLORS_VALUES);
export const PropsCompanyTuple = CompanyPropsLive.or(z.string());
export const PropsUseryTuple = UserPropsLive.optional()
  .nullable()
  .or(z.string());

export const AlertPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    userId: PropsUseryTuple,
    companyId: PropsCompanyTuple.optional(),
    // reserwationId: CompanyPropsLive,
    // serviceId: CompanyPropsLive,
    // commutingId: CompanyPropsLive,
    type: EnumAlertType,
    color: EnumAlertColor,
    active: z.boolean().optional(),
    createdAt: z.date().optional(),
  })
  .nullable();

export type AlertProps = z.infer<typeof AlertPropsLive>;
export type AlertType = z.infer<typeof EnumAlertType>;
export type AlertColor = z.infer<typeof EnumAlertColor>;
