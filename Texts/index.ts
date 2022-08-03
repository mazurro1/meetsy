import HomePage from "./frontend/HomePage";
import SelectCreated from "./frontend/ui/SelectCreated";
import InputIcon from "./frontend/ui/InputIcon";
import Form from "./frontend/ui/Form";
import According from "./frontend/ui/According";
import CalendarClicked from "./frontend/ui/CalendarClicked";
import Calendar from "./frontend/ui/Calendar";
import Timepicker from "./frontend/ui/Timepicker";
import Footer from "./frontend/Footer";
import ButtonTakeData from "./frontend/ui/ButtonTakeData";
import NavigationDown from "./frontend/NavigationDown";
import FiltersCompanysLocalization from "./frontend/company/FiltersCompanysLocalization";
import FiltersCompanysService from "./frontend/company/FiltersCompanysService";
import FiltersCompanys from "./frontend/company/FiltersCompanys";
import UpdatePasswordUserFromSocial from "./frontend/user/UpdatePasswordUserFromSocial";
import Layout from "./frontend/Layout";
import LoginPage from "./frontend/LoginPage";
import RegistrationPage from "./frontend/user/RegistrationPage";
import ApiErrors from "./api/ApiErrors";
import {z} from "zod";
import ConfirmEmailAdressUser from "./frontend/user/ConfirmEmailAdressUser";
import ConfirmEmail from "./api/ConfirmEmail";
import AdminCompany from "./api/AdminCompany";
import AccountPage from "./frontend/user/AccountPage";
import UpdateUserPhone from "./frontend/user/UpdateUserPhone";
import ConfirmPhone from "./api/ConfirmPhone";
import ConfirmPhoneUser from "./frontend/user/ConfirmPhoneUser";
import AccountApi from "./frontend/user/AccountApi";
import DeleteAccount from "./frontend/user/DeleteAccount";
import EditPassword from "./frontend/user/EditPassword";
import ChangePhoneUser from "./frontend/user/ChangePhoneUser";
import ConfirmNewPhoneUser from "./frontend/user/ConfirmNewPhoneUser";
import ChangeEmailUser from "./frontend/user/ChangeEmailUser";
import ConfirmNewEmailUser from "./frontend/user/ConfirmNewEmailUser";
import EditAccountUser from "./frontend/user/EditAccountUser";
import RecoverAccountUser from "./frontend/user/RecoverAccountUser";
import ConfirmRecoverAccountUser from "./frontend/user/ConfirmRecoverAccountUser";
import ManagaConsentsUser from "./frontend/user/ManagaConsentsUser";
import AlertsUser from "./frontend/user/AlertsUser";
import UploadImage from "./frontend/ui/UploadImage";
import ImagesAWS from "./api/ImagesAWS";
import DetectChanges from "./frontend/ui/DetectChanges";
import EditAvatarUser from "./frontend/user/EditAvatarUser";
import NavigationUp from "./frontend/NavigationUp";
import CompanyCreatePage from "./frontend/company/CompanyCreatePage";
import Company from "./api/Company";
import ConfirmEmailAdressCompany from "./frontend/company/ConfirmEmailAdressCompany";
import CompanyInformationAccording from "./frontend/company/CompanyInformationAccording";
import AccountCompanysPage from "./frontend/company/AccountCompanysPage";
import ResetPhoneCompany from "./frontend/company/ResetPhoneCompany";
import ChangeCompanyInformation from "./frontend/company/ChangeCompanyInformation";
import ChangeCompanyContact from "./frontend/company/ChangeCompanyContact";
import ConfirmNewEmailAdressCompany from "./frontend/company/ConfirmNewEmailAdressCompany";
import ChangeCompanyPhone from "./frontend/company/ChangeCompanyPhone";
import ConfirmNewPhoneCompany from "./frontend/company/ConfirmNewPhoneCompany";
import EnumWorkerPermissions from "./frontend/EnumWorkerPermissions";
import CompanyWorker from "./api/CompanyWorker";
import InivationsToCompanyUser from "./frontend/user/InivationsToCompanyUser";
import ActiveCompaniesToReserwation from "./frontend/user/ActiveCompaniesToReserwation";
import ActiveCompaniesToReserwationCompanyItem from "./frontend/user/ActiveCompaniesToReserwationCompanyItem";
import StripeWebhook from "./api/StripeWebhook";
import Tooltip from "./frontend/ui/Tooltip";
import BanCompany from "./frontend/admin/companys/BanCompany";
import RemoveWorkerFromCompany from "./frontend/admin/companys/RemoveWorkerFromCompany";
import AddWorkerToCompany from "./frontend/admin/companys/AddWorkerToCompany";
import ChangeWorkerAsAdmin from "./frontend/admin/companys/ChangeWorkerAsAdmin";
import ChangeWorkerPermissions from "./frontend/admin/companys/ChangeWorkerPermissions";
import CompanyWorkerInfo from "./frontend/admin/companys/CompanyWorkerInfo";
import AdminCompanysPage from "./frontend/admin/companys/AdminCompanysPage";
import EnumUserPermissions from "./frontend/EnumUserPermissions";
import EnumUserConsents from "./frontend/EnumUserConsents";
import BanUsers from "./frontend/admin/users/BanUsers";
import AdminUser from "./api/AdminUser";
import ChangeUserConsents from "./frontend/admin/users/ChangeUserConsents";
import AdminSubscriptionsItem from "./frontend/admin/products/AdminSubscriptionsItem";
import AdminSubscriptions from "./frontend/admin/products/AdminSubscriptions";
import AdminPagePackages from "./frontend/admin/products/AdminPagePackages";
import AdminCoupons from "./frontend/admin/coupons/AdminCoupons";
import AdminPageCoupons from "./frontend/admin/coupons/AdminPageCoupons";
import AdminCouponItem from "./frontend/admin/coupons/AdminCouponItem";
import AdminPage from "./frontend/admin/AdminPage";
import CancelSubscription from "./frontend/company/CancelSubscription";
import AddFundsCompanyProductsItem from "./frontend/company/AddFundsCompanyProductsItem";
import PaymentsCompanyProducts from "./frontend/company/PaymentsCompanyProducts";
import PaymentsCompany from "./frontend/company/PaymentsCompany";
import AddFundsCompany from "./frontend/company/AddFundsCompany";

export const LanguagesPropsLive = z.enum(["pl", "en"]);
export type LanguagesProps = z.infer<typeof LanguagesPropsLive>;

export interface AllTextsProps {
  [propObjectName: string]: {
    [propName: string]: string;
  };
}

export const AllTexts = {
  AdminCompany,
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
  ChangeCompanyContact,
  ConfirmNewEmailAdressCompany,
  ChangeCompanyPhone,
  ConfirmNewPhoneCompany,
  EnumWorkerPermissions,
  CompanyWorker,
  InivationsToCompanyUser,
  ActiveCompaniesToReserwation,
  ActiveCompaniesToReserwationCompanyItem,
  StripeWebhook,
  Tooltip,
  BanCompany,
  RemoveWorkerFromCompany,
  AddWorkerToCompany,
  ChangeWorkerAsAdmin,
  ChangeWorkerPermissions,
  CompanyWorkerInfo,
  AdminCompanysPage,
  EnumUserPermissions,
  EnumUserConsents,
  BanUsers,
  AdminUser,
  ChangeUserConsents,
  AdminSubscriptionsItem,
  AdminSubscriptions,
  AdminPagePackages,
  AdminPageCoupons,
  AdminCoupons,
  AdminCouponItem,
  AdminPage,
  CancelSubscription,
  AddFundsCompanyProductsItem,
  PaymentsCompanyProducts,
  PaymentsCompany,
  AddFundsCompany,
};
