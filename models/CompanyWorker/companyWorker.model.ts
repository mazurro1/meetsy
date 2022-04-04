import {z} from "zod";
import {UserPropsLive} from "@/models/User/user.model";
import {CompanyPropsLive} from "@/models/Company/company.model";

export const PropsUserTuple = UserPropsLive.or(z.string());
export const PropsCompanyTuple = CompanyPropsLive.or(z.string());

export const CompanyWorkerPropsLive = z.object({
  userId: PropsUserTuple,
  companyId: PropsCompanyTuple,
  permissions: z.number().array(),
  active: z.boolean(),
  specialization: z.string().optional().nullable(),
});

export const CompanyWorkerPropsLiveArray = CompanyWorkerPropsLive.array();

export enum EnumWorkerPermissions {
  admin = 1,
  manageCompanyInformations = 2,
  manageWorkers = 3,
  managePromotions = 4,
  manageCommutes = 5,
  manageServices = 6,
}

export type CompanyWorkerProps = z.infer<typeof CompanyWorkerPropsLive>;
