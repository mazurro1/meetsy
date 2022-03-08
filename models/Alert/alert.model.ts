import {z} from "zod";
import {UserPropsLive} from "../User/user.model";

const ALERT_COLORS_VALUES = [
  "PRIMARY",
  "SECOND",
  "RED",
  "GREEN",
  "GREY",
] as const;
const ALERT_TYPE_VALUES = [
  "CHANGE_PASSWORD",
  "CHANGE_EMAIL",
  "CHANGE_CONSENTS",
  "CHANGE_PHONE_NUMBER",
] as const;

export const EnumAlertType = z.enum(ALERT_TYPE_VALUES);
export const EnumAlertColor = z.enum(ALERT_COLORS_VALUES);

export const AlertPropsLive = z
  .object({
    _id: z.string().nonempty(),
    userId: UserPropsLive,
    // companyId: CompanyPropsLive,
    // reserwationId: CompanyPropsLive,
    // serviceId: CompanyPropsLive,
    // commutingId: CompanyPropsLive,
    type: EnumAlertType,
    color: EnumAlertColor,
    active: z.boolean(),
    createdAt: z.date(),
  })
  .nullable();

export type AlertProps = z.infer<typeof AlertPropsLive>;
