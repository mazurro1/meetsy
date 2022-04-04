import {z} from "zod";

export const CompanyPhoneLive = z.object({
  number: z.number().optional().nullable(),
  regionalCode: z.number().optional().nullable(),
  toConfirmNumber: z.number().optional().nullable(),
  toConfirmRegionalCode: z.number().optional().nullable(),
  has: z.boolean(),
  isConfirmed: z.boolean(),
  code: z.string().optional().nullable(),
  dateSendAgainSMS: z.date().optional().nullable(),
});

export const CompanyDetailsLive = z.object({
  name: z.string().optional(),
  nip: z.number().optional(),
  avatarUrl: z.string().optional().nullable(),
  images: z.string().array().optional().nullable(),
  emailIsConfirmed: z.boolean(),
  toConfirmEmail: z.string().email().nullable().optional(),
});

export const CompanyWithValuePlaceholder = z.object({
  placeholder: z.string(),
  value: z.string(),
});

export const CompanyContactLive = z.object({
  postalCode: z.string(),
  url: z.string(),
  city: CompanyWithValuePlaceholder,
  district: CompanyWithValuePlaceholder,
  street: CompanyWithValuePlaceholder,
});

export const CompanyPropsLive = z
  .object({
    _id: z.string().nonempty(),
    email: z.string().email().nonempty().optional(),
    emailCode: z.string().optional().nullable(),
    companyDetails: CompanyDetailsLive,
    companyContact: CompanyContactLive,
    phoneDetails: CompanyPhoneLive,
    updatedAt: z.string().or(z.date()).optional(),
    createdAt: z.string().or(z.date()).optional(),
  })
  .nullable();

export type CompanyPhoneProps = z.infer<typeof CompanyPhoneLive>;
export type CompanyProps = z.infer<typeof CompanyPropsLive>;