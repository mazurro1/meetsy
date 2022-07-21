import {LanguagesPropsLive} from "@Texts";
import {z} from "zod";
import {CompanyPropsLive} from "@/models/Company/company.model";
import type {LanguagesProps} from "@Texts";
import {AllTexts} from "@Texts";

export const PropsCompanyTuple = CompanyPropsLive.or(z.string());

export const UserEndpointKeysLive = z.object({
  p256dh: z.string().optional().nullable(),
  auth: z.string().optional().nullable(),
});

export const UserPushEndpointLive = z.object({
  endpoint: z.string().optional().nullable(),
  expirationTime: z.string().optional().nullable(),
  keys: UserEndpointKeysLive,
});

export const UserPhoneLive = z.object({
  number: z.number().optional().nullable(),
  regionalCode: z.number().optional().nullable(),
  toConfirmNumber: z.number().optional().nullable(),
  toConfirmRegionalCode: z.number().optional().nullable(),
  has: z.boolean(),
  isConfirmed: z.boolean(),
  dateSendAgainSMS: z.date().optional().nullable().or(z.string()),
});

export const UserDetailsLive = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  language: LanguagesPropsLive,
  avatarUrl: z.string().optional().nullable(),
  hasPassword: z.boolean(),
  emailIsConfirmed: z.boolean(),
  toConfirmEmail: z.string().email().nullable(),
});

export const UserPropsLive = z
  .object({
    _id: z.string().nonempty(),
    email: z.string().email().nonempty(),
    emailCode: z.string().optional().nullable(),
    phoneCode: z.string().optional().nullable(),
    recoverCode: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    banned: z.boolean().optional(),
    consents: z.number().array(),
    defaultCompanyId: PropsCompanyTuple,
    userDetails: UserDetailsLive,
    phoneDetails: UserPhoneLive,
    pushEndpoint: UserPushEndpointLive.optional(),
    permissions: z.number().array().optional().nullable(),
    updatedAt: z.string().or(z.date()).optional(),
    createdAt: z.string().or(z.date()).optional(),
  })
  .nullable();

export const UserPropsOnlyNameSurnameUrlLive = z.object({
  _id: z.string().nonempty(),
  userDetails: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    avatarUrl: z.string().optional().nullable(),
  }),
  email: z.string().optional(),
});

type NamesOfPermissions = "standard" | "premium" | "admin" | "superAdmin";

export const allNamesOfPermissions: NamesOfPermissions[] = [
  "standard",
  "premium",
  "admin",
  "superAdmin",
];

type NamesOfConsents =
  | "sendSmsAllServices"
  | "sendEmailsAllServices"
  | "sendEmailsMarketing"
  | "sendNotifications";

export const allNamesOfConsents: NamesOfConsents[] = [
  "sendSmsAllServices",
  "sendEmailsAllServices",
  "sendEmailsMarketing",
  "sendNotifications",
];

export enum EnumUserConsents {
  sendSmsAllServices = 1,
  sendEmailsAllServices = 2,
  sendEmailsMarketing = 3,
  sendNotifications = 4,
}

export enum EnumUserPermissions {
  standard = 1,
  premium = 2,
  admin = 10,
  superAdmin = 11,
}

interface GetAllNamesOfUserPermissionsProps {
  permissions: number[];
  language: LanguagesProps;
}

interface GetAllNamesOfUserConsentsProps {
  consents: number[];
  language: LanguagesProps;
}

interface GetEnumUserPermissionsProps {
  nameEnum: NamesOfPermissions | null;
  language: LanguagesProps;
}

interface GetEnumUserConsentsProps {
  nameEnum: NamesOfConsents | null;
  language: LanguagesProps;
}

export const getEnumUserConsents = ({
  nameEnum = null,
  language = "pl",
}: GetEnumUserConsentsProps) => {
  if (!!nameEnum) {
    switch (nameEnum) {
      case "sendSmsAllServices": {
        return AllTexts.EnumUserConsents[language].sendSmsAllServices;
      }
      case "sendEmailsAllServices": {
        return AllTexts.EnumUserConsents[language].sendEmailsAllServices;
      }
      case "sendEmailsMarketing": {
        return AllTexts.EnumUserConsents[language].sendEmailsMarketing;
      }
      case "sendNotifications": {
        return AllTexts.EnumUserConsents[language].sendNotifications;
      }

      default:
        return "";
    }
  } else {
    return "";
  }
};

export const getEnumUserPermissions = ({
  nameEnum = null,
  language = "pl",
}: GetEnumUserPermissionsProps) => {
  if (!!nameEnum) {
    switch (nameEnum) {
      case "standard": {
        return AllTexts.EnumUserPermissions[language].standard;
      }
      case "premium": {
        return AllTexts.EnumUserPermissions[language].premium;
      }
      case "admin": {
        return AllTexts.EnumUserPermissions[language].admin;
      }
      case "superAdmin": {
        return AllTexts.EnumUserPermissions[language].superAdmin;
      }

      default:
        return "";
    }
  } else {
    return "";
  }
};

interface ItemsPermissionsProps {
  permission: number;
  name: string;
}

interface ItemsConsentsProps {
  consent: number;
  name: string;
}

export const getAllNamesOfUserPermissions = ({
  permissions = [],
  language = "pl",
}: GetAllNamesOfUserPermissionsProps) => {
  const itemsPermissions: ItemsPermissionsProps[] = [];

  for (const permission of permissions) {
    if (permission > 0 && permission <= allNamesOfPermissions.length) {
      const textPermission = getEnumUserPermissions({
        // @ts-ignore
        nameEnum: EnumUserPermissions[permission],
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

export const getAllNamesOfUserConsents = ({
  consents = [],
  language = "pl",
}: GetAllNamesOfUserConsentsProps) => {
  const itemsPermissions: ItemsConsentsProps[] = [];

  for (const consent of consents) {
    if (consent > 0 && consent <= allNamesOfConsents.length) {
      const textConsent = getEnumUserConsents({
        // @ts-ignore
        nameEnum: EnumUserConsents[consent],
        language: language,
      });

      if (!!textConsent) {
        const itemWithText = {
          consent: consent,
          name: textConsent,
        };
        itemsPermissions.push(itemWithText);
      }
    }
  }

  return itemsPermissions;
};

export type UserEndpointKeysProps = z.infer<typeof UserEndpointKeysLive>;
export type UserPhoneProps = z.infer<typeof UserPhoneLive>;
export type UserPushEndpointProps = z.infer<typeof UserPushEndpointLive>;
export type UserProps = z.infer<typeof UserPropsLive>;
export type UserPropOnlyNameSurnameUrl = z.infer<
  typeof UserPropsOnlyNameSurnameUrlLive
>;
