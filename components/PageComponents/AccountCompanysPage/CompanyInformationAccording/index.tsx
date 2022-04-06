import {NextPage} from "next";
import {According, AccordingItem, Paragraph} from "@ui";
import {withTranslates} from "@hooks";
import type {ITranslatesProps} from "@hooks";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import {getFullDateWithTime} from "@functions";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

interface CompanyInformationAccordingProps {
  selectedUserCompany: CompanyWorkerProps;
}

const CompanyInformationAccording: NextPage<
  ITranslatesProps & CompanyInformationAccordingProps
> = ({selectedUserCompany, texts}) => {
  let isAdminCompany: boolean = false;
  let hasAccessToEdit: boolean = false;
  let companyEmailOrPhoneToVerified: boolean = false;
  let hasEmailAdresToConfirm: boolean = false;
  let hasPhoneToConfirm: boolean = false;
  let validHandleEdit = {};
  let contentCompany = null;

  const handleEditCompany = () => {};

  if (!!selectedUserCompany) {
    let companyName: string = "Error";
    isAdminCompany = selectedUserCompany.permissions.some((item) => {
      return item === EnumWorkerPermissions.admin;
    });

    hasAccessToEdit = selectedUserCompany.permissions.some(
      (item) => item === EnumWorkerPermissions.manageCompanyInformations
    );

    validHandleEdit =
      isAdminCompany || hasAccessToEdit ? {handleEdit: handleEditCompany} : {};

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
            }: <span>${selectedUserCompany.companyId!.companyContact.postalCode.toUpperCase()}, ${selectedUserCompany.companyId!.companyContact.city.placeholder.toUpperCase()}</span>`}
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
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${texts!.nip}: <span>${
              selectedUserCompany.companyId!.companyDetails.nip
            }</span>`}
          />
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
  CompanyInformationAccording,
  "CompanyInformationAccording"
);