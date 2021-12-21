import { HomePageTexts } from "./HomePage";
import { SelectCreatedTexts } from "./SelectCreated";
import { InputIcondTexts } from "./InputIcon";
import { FormTexts } from "./Form";
import { AccordingTexts } from "./According";
import { CalendarTexts } from "./Calendar";

export interface AllTextsProps {
  [propObjectName: string]: {
    [propName: string]: string;
  };
}

export const AllTexts = {
  pl: {
    According: {
      ...AccordingTexts.pl,
    },
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
    Calendar: {
      ...CalendarTexts.pl,
    },
  } as AllTextsProps,
  en: {
    According: {
      ...AccordingTexts.en,
    },
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
    Calendar: {
      ...CalendarTexts.en,
    },
  } as AllTextsProps,
};
