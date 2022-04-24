import {LanguagesPropsLive} from "@Texts";
import {z} from "zod";
import {CompanyPropsLive} from "@/models/Company/company.model";

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
    consents: z.number().array(),
    defaultCompanyId: PropsCompanyTuple,
    userDetails: UserDetailsLive,
    phoneDetails: UserPhoneLive,
    pushEndpoint: UserPushEndpointLive.optional(),
  })
  .nullable();

export const UserPropsOnlyNameSurnameUrlLive = z.object({
  _id: z.string().nonempty(),
  userDetails: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    avatarUrl: z.string().optional().nullable(),
  }),
});

export enum EnumUserConsents {
  sendSmsAllServices = 1,
  sendEmailsAllServices = 2,
  sendEmailsMarketing = 3,
  sendNotifications = 4,
}

export type UserEndpointKeysProps = z.infer<typeof UserEndpointKeysLive>;
export type UserPhoneProps = z.infer<typeof UserPhoneLive>;
export type UserPushEndpointProps = z.infer<typeof UserPushEndpointLive>;
export type UserProps = z.infer<typeof UserPropsLive>;
export type UserPropOnlyNameSurnameUrl = z.infer<
  typeof UserPropsOnlyNameSurnameUrlLive
>;
