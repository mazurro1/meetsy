import {z} from "zod";

export const GeolocationLocation = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const GeolocationPropsLive = z
  .object({
    _id: z.string().nonempty().optional(),
    adress: z.string(),
    location: GeolocationLocation,
  })
  .nullable();

export type GeolocationProps = z.infer<typeof GeolocationPropsLive>;
