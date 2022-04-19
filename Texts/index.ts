import HomePage from "./frontend/HomePage";
import SelectCreated from "./frontend/SelectCreated";
import InputIcon from "./frontend/InputIcon";
import Form from "./frontend/Form";
import According from "./frontend/According";
import CalendarClicked from "./frontend/CalendarClicked";
import Calendar from "./frontend/Calendar";
import Timepicker from "./frontend/Timepicker";
import Footer from "./frontend/Footer";
import ButtonTakeData from "./frontend/ButtonTakeData";
import NavigationDown from "./frontend/NavigationDown";
import FiltersCompanysLocalization from "./frontend/FiltersCompanysLocalization";
import FiltersCompanysService from "./frontend/FiltersCompanysService";
import FiltersCompanys from "./frontend/FiltersCompanys";
import UpdatePasswordUserFromSocial from "./frontend/UpdatePasswordUserFromSocial";
import Layout from "./frontend/Layout";
import LoginPage from "./frontend/LoginPage";
import RegistrationPage from "./frontend/RegistrationPage";
import ApiErrors from "./api/ApiErrors";
import {z} from "zod";
import ConfirmEmailAdressUser from "./frontend/ConfirmEmailAdressUser";
import ConfirmEmail from "./api/ConfirmEmail";
import AccountPage from "./frontend/AccountPage";
import UpdateUserPhone from "./frontend/UpdateUserPhone";
import ConfirmPhone from "./api/ConfirmPhone";
import ConfirmPhoneUser from "./frontend/ConfirmPhoneUser";
import AccountApi from "./frontend/AccountApi";
import DeleteAccount from "./frontend/DeleteAccount";
import EditPassword from "./frontend/EditPassword";
import ChangePhoneUser from "./frontend/ChangePhoneUser";
import ConfirmNewPhoneUser from "./frontend/ConfirmNewPhoneUser";
import ChangeEmailUser from "./frontend/ChangeEmailUser";
import ConfirmNewEmailUser from "./frontend/ConfirmNewEmailUser";
import EditAccountUser from "./frontend/EditAccountUser";
import RecoverAccountUser from "./frontend/RecoverAccountUser";
import ConfirmRecoverAccountUser from "./frontend/ConfirmRecoverAccountUser";
import ManagaConsentsUser from "./frontend/ManagaConsentsUser";
import AlertsUser from "./frontend/AlertsUser";
import UploadImage from "./frontend/UploadImage";
import ImagesAWS from "./api/ImagesAWS";
import DetectChanges from "./frontend/DetectChanges";
import EditAvatarUser from "./frontend/EditAvatarUser";
import NavigationUp from "./frontend/NavigationUp";
import CompanyCreatePage from "./frontend/CompanyCreatePage";
import Company from "./api/Company";
import ConfirmEmailAdressCompany from "./frontend/ConfirmEmailAdressCompany";
import CompanyInformationAccording from "./frontend/CompanyInformationAccording";
import AccountCompanysPage from "./frontend/AccountCompanysPage";
import ResetPhoneCompany from "./frontend/ResetPhoneCompany";
import ChangeCompanyInformation from "./frontend/ChangeCompanyInformation";

export const LanguagesPropsLive = z.enum(["pl", "en"]);
export type LanguagesProps = z.infer<typeof LanguagesPropsLive>;

export interface AllTextsProps {
  [propObjectName: string]: {
    [propName: string]: string;
  };
}

export const AllTexts = {
  According,
  HomePage,
  SelectCreated,
  InputIcon,
  Form,
  CalendarClicked,
  Calendar,
  Timepicker,
  Footer,
  ButtonTakeData,
  NavigationDown,
  FiltersCompanysLocalization,
  FiltersCompanysService,
  FiltersCompanys,
  UpdatePasswordUserFromSocial,
  Layout,
  LoginPage,
  RegistrationPage,
  ApiErrors,
  ConfirmEmailAdressUser,
  ConfirmEmail,
  AccountPage,
  UpdateUserPhone,
  ConfirmPhone,
  ConfirmPhoneUser,
  AccountApi,
  DeleteAccount,
  EditPassword,
  ChangePhoneUser,
  ConfirmNewPhoneUser,
  ChangeEmailUser,
  ConfirmNewEmailUser,
  EditAccountUser,
  RecoverAccountUser,
  ConfirmRecoverAccountUser,
  ManagaConsentsUser,
  AlertsUser,
  UploadImage,
  ImagesAWS,
  DetectChanges,
  EditAvatarUser,
  NavigationUp,
  CompanyCreatePage,
  Company,
  ConfirmEmailAdressCompany,
  CompanyInformationAccording,
  AccountCompanysPage,
  ResetPhoneCompany,
  ChangeCompanyInformation,
};
