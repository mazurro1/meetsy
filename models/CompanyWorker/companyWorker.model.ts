import {z} from "zod";
import {UserPropsLive} from "@/models/User/user.model";
import {CompanyPropsLive} from "@/models/Company/company.model";

export const PropsUserTuple = UserPropsLive.or(z.string());
export const PropsCompanyTuple = CompanyPropsLive.array().or(
  z.string().array()
);

export const CompanyWorkerPropsLive = z.object({
  userId: PropsUserTuple,
  companyId: PropsCompanyTuple,
  permissions: z.number().array(),
  active: z.boolean(),
  specialization: z.string().optional().nullable(),
});

export enum EnumWorkerPermissions {
  admin = 1,
  editCompany = 2,
}

export type CompanyWorkerProps = z.infer<typeof CompanyWorkerPropsLive>;
