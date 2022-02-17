import {HomePageTexts} from "./HomePage";
import {SelectCreatedTexts} from "./SelectCreated";
import {InputIcondTexts} from "./InputIcon";
import {FormTexts} from "./Form";
import {AccordingTexts} from "./According";
import {CalendarClickedTexts} from "./CalendarClicked";
import {CalendarTexts} from "./Calendar";
import {TimepickerTexts} from "./Timepicker";
import {FooterTexts} from "./Footer";
import {ButtonTakeDataTexts} from "./ButtonTakeData";
import {NavigationDownTexts} from "./NavigationDown";
import {FiltersCompanysLocalizationTexts} from "./FiltersCompanysLocalization";
import {FiltersCompanysServiceTexts} from "./FiltersCompanysService";
import {FiltersCompanysTexts} from "./FiltersCompanys";
import {UpdatePasswordUserFromSocialTexts} from "./UpdatePasswordUserFromSocial";
import {LayoutTexts} from "./Layout";
import {LoginPageTexts} from "./LoginPage";
import {RegistrationPageTexts} from "./RegistrationPage";
import {ApiErrorsTexts} from "./ApiErrors";
import {z} from "zod";

export const LanguagesPropsLive = z.enum(["pl", "en"]);
export type LanguagesProps = z.infer<typeof LanguagesPropsLive>;

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
    CalendarClicked: {
      ...CalendarClickedTexts.pl,
    },
    Calendar: {
      ...CalendarTexts.pl,
    },
    Timepicker: {
      ...TimepickerTexts.pl,
    },
    Footer: {
      ...FooterTexts.pl,
    },
    ButtonTakeData: {
      ...ButtonTakeDataTexts.pl,
    },
    NavigationDown: {
      ...NavigationDownTexts.pl,
    },
    FiltersCompanysLocalization: {
      ...FiltersCompanysLocalizationTexts.pl,
    },
    FiltersCompanysService: {
      ...FiltersCompanysServiceTexts.pl,
    },
    FiltersCompanys: {
      ...FiltersCompanysTexts.pl,
    },
    UpdatePasswordUserFromSocial: {
      ...UpdatePasswordUserFromSocialTexts.pl,
    },
    Layout: {
      ...LayoutTexts.pl,
    },
    LoginPage: {
      ...LoginPageTexts.pl,
    },
    RegistrationPage: {
      ...RegistrationPageTexts.pl,
    },
    ApiErrors: {
      ...ApiErrorsTexts.pl,
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
    CalendarClicked: {
      ...CalendarClickedTexts.en,
    },
    Calendar: {
      ...CalendarTexts.en,
    },
    Timepicker: {
      ...TimepickerTexts.en,
    },
    Footer: {
      ...FooterTexts.en,
    },
    ButtonTakeData: {
      ...ButtonTakeDataTexts.en,
    },
    NavigationDown: {
      ...NavigationDownTexts.en,
    },
    FiltersCompanysLocalization: {
      ...FiltersCompanysLocalizationTexts.en,
    },
    FiltersCompanysService: {
      ...FiltersCompanysServiceTexts.en,
    },
    FiltersCompanys: {
      ...FiltersCompanysTexts.en,
    },
    UpdatePasswordUserFromSocial: {
      ...UpdatePasswordUserFromSocialTexts.en,
    },
    Layout: {
      ...LayoutTexts.en,
    },
    LoginPage: {
      ...LoginPageTexts.en,
    },
    RegistrationPage: {
      ...RegistrationPageTexts.en,
    },
    ApiErrors: {
      ...ApiErrorsTexts.en,
    },
  } as AllTextsProps,
};
