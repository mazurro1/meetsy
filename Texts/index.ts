import {HomePageTexts} from "./frontend/HomePage";
import {SelectCreatedTexts} from "./frontend/SelectCreated";
import {InputIcondTexts} from "./frontend/InputIcon";
import {FormTexts} from "./frontend/Form";
import {AccordingTexts} from "./frontend/According";
import {CalendarClickedTexts} from "./frontend/CalendarClicked";
import {CalendarTexts} from "./frontend/Calendar";
import {TimepickerTexts} from "./frontend/Timepicker";
import {FooterTexts} from "./frontend/Footer";
import {ButtonTakeDataTexts} from "./frontend/ButtonTakeData";
import {NavigationDownTexts} from "./frontend/NavigationDown";
import {FiltersCompanysLocalizationTexts} from "./frontend/FiltersCompanysLocalization";
import {FiltersCompanysServiceTexts} from "./frontend/FiltersCompanysService";
import {FiltersCompanysTexts} from "./frontend/FiltersCompanys";
import {UpdatePasswordUserFromSocialTexts} from "./frontend/UpdatePasswordUserFromSocial";
import {LayoutTexts} from "./frontend/Layout";
import {LoginPageTexts} from "./frontend/LoginPage";
import {RegistrationPageTexts} from "./frontend/RegistrationPage";
import {ApiErrorsTexts} from "./api/ApiErrors";
import {z} from "zod";
import {ConfirmEmailAdressUserTexts} from "./frontend/ConfirmEmailAdressUser";
import {ConfirmEmailTexts} from "./api/ConfirmEmail";
import {AccountPageTexts} from "./frontend/AccountPage";
import {UpdateUserPhoneTexts} from "./frontend/UpdateUserPhone";
import {ConfirmPhoneTexts} from "./api/ConfirmPhone";
import {ConfirmPhoneUserTexts} from "./frontend/ConfirmPhoneUser";
import {AccountApiTexts} from "./frontend/AccountApi";
import {DeleteAccountTexts} from "./frontend/DeleteAccount";
import {EditPasswordTexts} from "./frontend/EditPassword";
import {ChangePhoneUserTexts} from "./frontend/ChangePhoneUser";
import {ConfirmNewPhoneUserTexts} from "./frontend/ConfirmNewPhoneUser";
import {ChangeEmailUserTexts} from "./frontend/ChangeEmailUser";
import {ConfirmNewEmailUserTexts} from "./frontend/ConfirmNewEmailUser";
import {EditAccountUserTexts} from "./frontend/EditAccountUser";
import {RecoverAccountUserTexts} from "./frontend/RecoverAccountUser";
import {ConfirmRecoverAccountUserTexts} from "./frontend/ConfirmRecoverAccountUser";
import {ManagaConsentsUserTexts} from "./frontend/ManagaConsentsUser";
import {AlertsUserTexts} from "./frontend/AlertsUser";
import {UploadImageTexts} from "./frontend/UploadImage";
import {ImagesAWSTexts} from "./api/ImagesAWS";
import {DetectChangesTexts} from "./frontend/DetectChanges";

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
    ConfirmEmailAdressUser: {
      ...ConfirmEmailAdressUserTexts.pl,
    },
    ConfirmEmail: {
      ...ConfirmEmailTexts.pl,
    },
    AccountPage: {
      ...AccountPageTexts.pl,
    },
    UpdateUserPhone: {
      ...UpdateUserPhoneTexts.pl,
    },
    ConfirmPhone: {
      ...ConfirmPhoneTexts.pl,
    },
    ConfirmPhoneUser: {
      ...ConfirmPhoneUserTexts.pl,
    },
    AccountApi: {
      ...AccountApiTexts.pl,
    },
    DeleteAccount: {
      ...DeleteAccountTexts.pl,
    },
    EditPassword: {
      ...EditPasswordTexts.pl,
    },
    ChangePhoneUser: {
      ...ChangePhoneUserTexts.pl,
    },
    ConfirmNewPhoneUser: {
      ...ConfirmNewPhoneUserTexts.pl,
    },
    ChangeEmailUser: {
      ...ChangeEmailUserTexts.pl,
    },
    ConfirmNewEmailUser: {
      ...ConfirmNewEmailUserTexts.pl,
    },
    EditAccountUser: {
      ...EditAccountUserTexts.pl,
    },
    RecoverAccountUser: {
      ...RecoverAccountUserTexts.pl,
    },
    ConfirmRecoverAccountUser: {
      ...ConfirmRecoverAccountUserTexts.pl,
    },
    ManagaConsentsUser: {
      ...ManagaConsentsUserTexts.pl,
    },
    AlertsUser: {
      ...AlertsUserTexts.pl,
    },
    UploadImage: {
      ...UploadImageTexts.pl,
    },
    ImagesAWS: {
      ...ImagesAWSTexts.pl,
    },
    DetectChanges: {
      ...DetectChangesTexts.pl,
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
    ConfirmEmailAdressUser: {
      ...ConfirmEmailAdressUserTexts.en,
    },
    ConfirmEmail: {
      ...ConfirmEmailTexts.en,
    },
    AccountPage: {
      ...AccountPageTexts.en,
    },
    UpdateUserPhone: {
      ...UpdateUserPhoneTexts.en,
    },
    ConfirmPhone: {
      ...ConfirmPhoneTexts.en,
    },
    ConfirmPhoneUser: {
      ...ConfirmPhoneUserTexts.en,
    },
    AccountApi: {
      ...AccountApiTexts.en,
    },
    DeleteAccount: {
      ...DeleteAccountTexts.en,
    },
    EditPassword: {
      ...EditPasswordTexts.en,
    },
    ChangePhoneUser: {
      ...ChangePhoneUserTexts.en,
    },
    ConfirmNewPhoneUser: {
      ...ConfirmNewPhoneUserTexts.en,
    },
    ChangeEmailUser: {
      ...ChangeEmailUserTexts.en,
    },
    ConfirmNewEmailUser: {
      ...ConfirmNewEmailUserTexts.en,
    },
    EditAccountUser: {
      ...EditAccountUserTexts.en,
    },
    RecoverAccountUser: {
      ...RecoverAccountUserTexts.en,
    },
    ConfirmRecoverAccountUser: {
      ...ConfirmRecoverAccountUserTexts.en,
    },
    ManagaConsentsUser: {
      ...ManagaConsentsUserTexts.en,
    },
    AlertsUser: {
      ...AlertsUserTexts.en,
    },
    UploadImage: {
      ...UploadImageTexts.en,
    },
    ImagesAWS: {
      ...ImagesAWSTexts.en,
    },
    DetectChanges: {
      ...DetectChangesTexts.en,
    },
  } as AllTextsProps,
};
