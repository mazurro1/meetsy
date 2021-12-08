import { HomePageTexts } from "./HomePage";
import { SelectCreatedTexts } from "./SelectCreated";
import { InputIcondTexts } from "./InputIcon";
import { FormTexts } from "./Form";

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
    SelectCreated: {
      ...SelectCreatedTexts.pl,
    },
    InputIcon: {
      ...InputIcondTexts.pl,
    },
    Form: {
      ...FormTexts.pl,
    },
  } as AllTextsProps,
  en: {
    HomePage: {
      ...HomePageTexts.en,
    },
    SelectCreated: {
      ...SelectCreatedTexts.en,
    },
    InputIcon: {
      ...InputIcondTexts.en,
    },
    Form: {
      ...FormTexts.en,
    },
  } as AllTextsProps,
};
