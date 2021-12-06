import { HomePageTexts } from "./HomePage";
import { SelectCreatedTexts } from "./SelectCreated";

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
  } as AllTextsProps,
  en: {
    HomePage: {
      ...HomePageTexts.en,
    },
    SelectCreated: {
      ...SelectCreatedTexts.en,
    },
  } as AllTextsProps,
};
