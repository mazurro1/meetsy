import {NextPage} from "next";
import {According, AccordingItem, Paragraph} from "@ui";
import {withTranslates, withSiteProps} from "@hooks";
import type {ITranslatesProps, ISiteProps} from "@hooks";
import {getFullDateWithTime} from "@functions";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

interface CompanyInformationAccordingProps {
  selectedUserCompany: CompanyWorkerProps;
  companyId: string;
  enableEdit: boolean;
  hasAccessToEdit: boolean;
  isAdminCompany: boolean;
  loadingToChangeRouteLink: string;
}

const CompanyInformationAccording: NextPage<
  ITranslatesProps & CompanyInformationAccordingProps & ISiteProps
> = ({
  selectedUserCompany,
  texts,
  router,
  companyId,
  enableEdit = false,
  hasAccessToEdit = false,
  isAdminCompany = false,
  loadingToChangeRouteLink,
}) => {
  let companyEmailOrPhoneToVerified: boolean = false;
  let hasEmailAdresToConfirm: boolean = false;
  let hasPhoneToConfirm: boolean = false;
  let validHandleEdit = {};
  let contentCompany = null;
  let companyZipCode = "";

  if (!!selectedUserCompany) {
    let companyName: string = "Error";

    validHandleEdit =
      (isAdminCompany || hasAccessToEdit) && enableEdit
        ? {loadingToChangeRouteLink: loadingToChangeRouteLink}
        : {};

    if (typeof selectedUserCompany.companyId !== "string") {
      if (!!selectedUserCompany.companyId!.companyDetails.name) {
        companyName =
          selectedUserCompany.companyId!.companyDetails.name?.toUpperCase();
      }

      if (
        (!!!selectedUserCompany.companyId!.companyDetails.emailIsConfirmed ||
          !!!selectedUserCompany.companyId!.phoneDetails.isConfirmed) &&
        isAdminCompany
      ) {
        companyEmailOrPhoneToVerified = true;
      }

      if (!!!selectedUserCompany.companyId!.companyDetails.emailIsConfirmed) {
        hasEmailAdresToConfirm = true;
      }

      if (!!!selectedUserCompany.companyId!.phoneDetails.isConfirmed) {
        hasPhoneToConfirm = true;
      }

      if (!!selectedUserCompany.companyId!.companyContact.postalCode) {
        const postalCodeFromCompany: string =
          selectedUserCompany.companyId!.companyContact.postalCode.toString();
        if (!!postalCodeFromCompany) {
          companyZipCode = `${postalCodeFromCompany.slice(
            0,
            2
          )}-${postalCodeFromCompany.slice(2, postalCodeFromCompany.length)}`;
        }
      }

      contentCompany = (
        <>
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${
              texts!.name
            }: <span>${companyName}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${
              texts!.city
            }: <span>${companyZipCode}, ${selectedUserCompany.companyId!.companyContact.city.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${
              texts!.district
            }: <span>${selectedUserCompany.companyId!.companyContact.district.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${
              texts!.street
            }: <span>${selectedUserCompany.companyId!.companyContact.street.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${texts!.phoneNumber}: <span>+${
              selectedUserCompany.companyId!.phoneDetails.regionalCode
            } ${selectedUserCompany.companyId!.phoneDetails.number}</span>`}
          />
          {!!selectedUserCompany.companyId!.companyDetails.nip && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${texts!.nip}: <span>${
                selectedUserCompany.companyId!.companyDetails.nip
              }</span>`}
            />
          )}
          {!!selectedUserCompany.companyId!.updatedAt && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${
                texts!.lastUpdate
              }: <span>${getFullDateWithTime(
                new Date(selectedUserCompany.companyId!.updatedAt)
              )}</span>`}
            />
          )}
          {!!selectedUserCompany.companyId!.createdAt && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${
                texts!.created
              }: <span>${getFullDateWithTime(
                new Date(selectedUserCompany.companyId!.createdAt)
              )}</span>`}
            />
          )}
          {hasEmailAdresToConfirm && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="RED_DARK"
              dangerouslySetInnerHTML={`<span>${
                texts!.emailNoConfirmed
              }</span>`}
            />
          )}
          {hasPhoneToConfirm && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="RED_DARK"
              dangerouslySetInnerHTML={`<span>${
                texts!.phoneNoConfirmed
              }</span>`}
            />
          )}
        </>
      );
    }
  }

  return (
    <>
      {!!selectedUserCompany && (
        <>
          {(isAdminCompany || hasAccessToEdit) && (
            <div className="flex-center-center mb-10 mt-20">
              <According
                id="according_user_companys"
                title={texts!.dataCompany}
                marginTop={0}
                width="400px"
                marginBottom={0}
                defaultIsOpen
                color={
                  companyEmailOrPhoneToVerified && isAdminCompany
                    ? "RED"
                    : "PRIMARY"
                }
              >
                <AccordingItem
                  id="according_user_company"
                  {...validHandleEdit}
                  userSelect
                  index={0}
                >
                  {contentCompany}
                </AccordingItem>
              </According>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default withTranslates(
  withSiteProps(CompanyInformationAccording),
  "CompanyInformationAccording"
);
