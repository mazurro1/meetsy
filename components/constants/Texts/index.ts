import { HomePageTexts } from "./HomePage";

export interface AllTextsProps {
  [propObjectName: string]: {
    [propName: string]: string;
  };
}

export const AllTexts = {
  pl: {
    HomePage: {
      ...HomePageTexts.pl,
    },
  } as AllTextsProps,
  en: {
    HomePage: {
      ...HomePageTexts.en,
    },
  } as AllTextsProps,
};
