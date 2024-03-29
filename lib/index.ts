import {hashPassword} from "./HashPassword";
import {verifyPassword} from "./VerifyPassword";
import {SendEmail} from "./Notifications/email";
import {SendWebPush} from "./Notifications/webpush";
import {SendSMS, UploadAWSImage, DeleteAWSImage} from "./Notifications/aws";
import {SendSocketIO} from "./Notifications/socketio";
import {GetGUSCompanyInfo} from "./Notifications/gus";
import {UserAlertsGenerator} from "./Notifications/userAlertsGenerator";
import {randomString} from "./RandomString";
import {
  checkUserAccountIsConfirmed,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  checkUserAccountIsConfirmedAndReturnUser,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnCompanyWorker,
  findValidCompany,
  findValidQueryCompanys,
  findValidUser,
  checkAuthUserSessionAndReturnData,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  findValidQueryCompanysAll,
  findValidUserAdmin,
  findValidUserSuperAdminWithPassword,
  findValidUserSuperAdmin,
  findValidUserId,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndValidPassword,
  findValidNormalUserWithPassword,
} from "./fetchPermissions";
import {getGeolocation} from "./geolocation";
import {findValidUserAdminWithPassword} from "./fetchPermissions";

export {
  randomString,
  hashPassword,
  verifyPassword,
  SendEmail,
  SendSMS,
  SendWebPush,
  SendSocketIO,
  GetGUSCompanyInfo,
  UploadAWSImage,
  UserAlertsGenerator,
  DeleteAWSImage,
  checkUserAccountIsConfirmed,
  checkUserAccountIsConfirmedAndHaveCompanyPermissions,
  checkUserAccountIsConfirmedAndReturnUser,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnCompanyWorker,
  findValidCompany,
  findValidUser,
  findValidQueryCompanys,
  checkAuthUserSessionAndReturnData,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndReturnUser,
  getGeolocation,
  findValidQueryCompanysAll,
  findValidUserAdmin,
  findValidUserAdminWithPassword,
  findValidUserSuperAdminWithPassword,
  findValidUserSuperAdmin,
  findValidUserId,
  checkUserAccountIsConfirmedAndHaveCompanyPermissionsAndValidPassword,
  findValidNormalUserWithPassword,
};
