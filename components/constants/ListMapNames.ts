export interface ListMapProps {
  value: number;
  label: string;
}

export interface ListMapPropsLanguage {
  pl: ListMapProps[];
  en: ListMapProps[];
}

export const ListMapNames: ListMapPropsLanguage = {
  pl: [
    {
      value: 1,
      label: "Lista ofert",
    },
    {
      value: 2,
      label: "Mapy ofert",
    },
  ],
  en: [
    {
      value: 1,
      label: "List of offers",
    },
    {
      value: 2,
      label: "Offer map",
    },
  ],
};
