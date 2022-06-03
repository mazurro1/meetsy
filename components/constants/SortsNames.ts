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
      value: 3,
      label: "Najczęsciej oceniane",
    },
    {
      value: 4,
      label: "Najwyżej oceniane",
    },
    {
      value: 1,
      label: "Od A-Z",
    },
    {
      value: 2,
      label: "Od Z-A",
    },
  ],
  en: [
    {
      value: 3,
      label: "Mostly rated",
    },
    {
      value: 4,
      label: "Top rated",
    },
    {
      value: 1,
      label: "From A-Z",
    },
    {
      value: 2,
      label: "From Z-A",
    },
  ],
};
