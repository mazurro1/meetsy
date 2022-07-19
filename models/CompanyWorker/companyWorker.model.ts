import {z} from "zod";
import {UserPropsOnlyNameSurnameUrlLive} from "@/models/User/user.model";
import {
  CompanyPropsShowNameLive,
  CompanyPropsLive,
} from "@/models/Company/company.model";
import type {LanguagesProps} from "@Texts";
import {AllTexts} from "@Texts";

export const PropsUserTuple = UserPropsOnlyNameSurnameUrlLive.or(z.string());
export const PropsCompanyTuple = CompanyPropsLive.or(z.string());
export const PropsCompanyTupleOnlyInformation = CompanyPropsShowNameLive.or(
  z.string()
);

export const CompanyWorkerPropsLive = z.object({
  _id: z.string(),
  userId: PropsUserTuple,
  companyId: PropsCompanyTuple,
  permissions: z.number().array(),
  active: z.boolean(),
  specialization: z.string().optional().nullable(),
  updatedAt: z.string().or(z.date()).optional(),
  createdAt: z.string().or(z.date()).optional(),
});

export const CompanyWorkerPropsShowCompanyNameLive = z.object({
  _id: z.string(),
  userId: PropsUserTuple,
  companyId: PropsCompanyTupleOnlyInformation,
  permissions: z.number().array(),
  active: z.boolean(),
  specialization: z.string().optional().nullable(),
  updatedAt: z.string().or(z.date()).optional(),
  createdAt: z.string().or(z.date()).optional(),
});

export const CompanyWorkerPropsLiveArray = CompanyWorkerPropsLive.array();

export enum EnumWorkerPermissions {
  admin = 1,
  editAllServices = 2,
  viewClientsInformations = 3,
  manageCompanyInformations = 4,
  manageWorkers = 5,
  manageReserwations = 6,
  managePromotions = 7,
  manageCommutes = 8,
  manageServices = 9,
  manageStamps = 10,
  manageHappyHours = 11,
  manageLastMinutes = 12,
  viewStatistic = 13,
}

type NamesOfPermissions =
  | "admin"
  | "editAllServices"
  | "viewClientsInformations"
  | "manageCompanyInformations"
  | "manageWorkers"
  | "manageReserwations"
  | "managePromotions"
  | "manageCommutes"
  | "manageServices"
  | "manageStamps"
  | "manageHappyHours"
  | "manageLastMinutes"
  | "viewStatistic";

export const allNamesOfPermissions: NamesOfPermissions[] = [
  "admin",
  "editAllServices",
  "viewClientsInformations",
  "manageCompanyInformations",
  "manageWorkers",
  "manageReserwations",
  "managePromotions",
  "manageCommutes",
  "manageServices",
  "manageStamps",
  "manageHappyHours",
  "manageLastMinutes",
  "viewStatistic",
];

interface GetEnumWorkerPermissionsProps {
  nameEnum: NamesOfPermissions | null;
  language: LanguagesProps;
}

export const getEnumWorkerPermissions = ({
  nameEnum = null,
  language = "pl",
}: GetEnumWorkerPermissionsProps) => {
  if (!!nameEnum) {
    switch (nameEnum) {
      case "admin": {
        return AllTexts.EnumWorkerPermissions[language].admin;
      }

      case "editAllServices": {
        return AllTexts.EnumWorkerPermissions[language].editAllServices;
      }

      case "viewClientsInformations": {
        return AllTexts.EnumWorkerPermissions[language].viewClientsInformations;
      }

      case "manageCompanyInformations": {
        return AllTexts.EnumWorkerPermissions[language]
          .manageCompanyInformations;
      }

      case "manageWorkers": {
        return AllTexts.EnumWorkerPermissions[language].manageWorkers;
      }

      case "manageReserwations": {
        return AllTexts.EnumWorkerPermissions[language].manageReserwations;
      }

      case "managePromotions": {
        return AllTexts.EnumWorkerPermissions[language].managePromotions;
      }

      case "manageCommutes": {
        return AllTexts.EnumWorkerPermissions[language].manageCommutes;
      }

      case "manageServices": {
        return AllTexts.EnumWorkerPermissions[language].manageServices;
      }

      case "manageStamps": {
        return AllTexts.EnumWorkerPermissions[language].manageStamps;
      }

      case "manageHappyHours": {
        return AllTexts.EnumWorkerPermissions[language].manageHappyHours;
      }

      case "manageLastMinutes": {
        return AllTexts.EnumWorkerPermissions[language].manageLastMinutes;
      }

      case "viewStatistic": {
        return AllTexts.EnumWorkerPermissions[language].viewStatistic;
      }

      default:
        return "";
    }
  } else {
    return "";
  }
};

interface GetAllNamesOfWorkerPermissionsProps {
  permissions: number[];
  language: LanguagesProps;
}

export interface ItemsPermissionsProps {
  permission: number;
  name: string;
}

export const getAllNamesOfWorkerPermissions = ({
  permissions = [],
  language = "pl",
}: GetAllNamesOfWorkerPermissionsProps) => {
  const itemsPermissions: ItemsPermissionsProps[] = [];

  for (const permission of permissions) {
    if (permission > 0 && permission <= allNamesOfPermissions.length) {
      const textPermission = getEnumWorkerPermissions({
        // @ts-ignore
        nameEnum: EnumWorkerPermissions[permission],
        language: language,
      });

      if (!!textPermission) {
        const itemWithText = {
          permission: permission,
          name: textPermission,
        };
        itemsPermissions.push(itemWithText);
      }
    }
  }

  return itemsPermissions;
};

export type CompanyWorkerProps = z.infer<typeof CompanyWorkerPropsLive>;
