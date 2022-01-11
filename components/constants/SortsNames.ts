export interface SortsNamesProps {
  value: number;
  label: string;
}

export interface SortsNamesPropsLanguage {
  pl: SortsNamesProps[];
  en: SortsNamesProps[];
}

export const SortsNames: SortsNamesPropsLanguage = {
  pl: [
    {
      value: 1,
      label: "Najwyżej oceniane",
    },
    {
      value: 2,
      label: "Najczęsciej oceniane",
    },
    {
      value: 3,
      label: "Od A-Z",
    },
    {
      value: 4,
      label: "Od Z-A",
    },
  ],
  en: [
    {
      value: 1,
      label: "Top rated",
    },
    {
      value: 2,
      label: "Mostly rated",
    },
    {
      value: 3,
      label: "From A-Z",
    },
    {
      value: 4,
      label: "From Z-A",
    },
  ],
};
