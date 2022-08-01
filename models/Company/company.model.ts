import {z} from "zod";

export const CompanyPhoneLive = z.object({
  number: z.number().optional().nullable(),
  regionalCode: z.number().optional().nullable(),
  toConfirmNumber: z.number().optional().nullable(),
  toConfirmRegionalCode: z.number().optional().nullable(),
  has: z.boolean(),
  isConfirmed: z.boolean(),
  dateSendAgainSMS: z.date().optional().nullable().or(z.string()),
});

export const CompanyDetailsLive = z.object({
  name: z.string().optional(),
  nip: z.number().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  images: z.string().array().optional().nullable(),
  emailIsConfirmed: z.boolean(),
  toConfirmEmail: z.string().email().nullable().optional(),
});

export const CompanyWithValuePlaceholder = z.object({
  placeholder: z.string(),
  value: z.string(),
});

export const CompanyLocation = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export const TYPES_OF_COUNTRY = ["PL", "UA"] as const;
export const EnumTypeCountry = z.enum(TYPES_OF_COUNTRY);

export const CompanyContactLive = z.object({
  country: EnumTypeCountry,
  postalCode: z.number(),
  url: z.string(),
  city: CompanyWithValuePlaceholder,
  district: CompanyWithValuePlaceholder,
  street: CompanyWithValuePlaceholder,
  location: CompanyLocation.nullable(),
});

export const CompanyPropsLive = z
  .object({
    _id: z.string().nonempty(),
    email: z.string().email().nonempty().optional(),
    emailCode: z.string().optional().nullable(),
    banned: z.boolean().optional(),
    sms: z.number().optional(),
    points: z.number().optional(),
    subscriptiopnEndDate: z.string().optional(),
    phoneCode: z.string().optional().nullable(),
    companyDetails: CompanyDetailsLive,
    companyContact: CompanyContactLive,
    phoneDetails: CompanyPhoneLive,
    stripeCustomerId: z.string().optional().nullable(),
    updatedAt: z.string().or(z.date()).optional(),
    createdAt: z.string().or(z.date()).optional(),
  })
  .nullable();

export const CompanyPropsShowNameLive = z
  .object({
    _id: z.string().nonempty(),
    companyDetails: z.object({
      name: z.string().optional(),
      avatarUrl: z.string().optional().nullable(),
    }),
    companyContact: CompanyContactLive,
  })
  .nullable();

export type CompanyLocationProps = z.infer<typeof CompanyLocation>;
export type CompanyContactProps = z.infer<typeof CompanyContactLive>;
export type CompanyPhoneProps = z.infer<typeof CompanyPhoneLive>;
export type CompanyProps = z.infer<typeof CompanyPropsLive>;
export type CompanyPropsShowName = z.infer<typeof CompanyPropsShowNameLive>;
