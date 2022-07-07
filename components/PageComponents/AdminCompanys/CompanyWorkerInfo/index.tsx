import {NextPage} from "next";
import {ButtonIcon, According, Paragraph, FetchData} from "@ui";
import {withTranslates, withSiteProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import {getFullDateWithTime} from "@functions";
import RemoveWorkerFromCompany from "../RemoveWorkerFromCompany";
import {useState} from "react";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";

interface CompanyWorkerInfoProps {
  item: CompanyWorkerProps;
  index: number;
  mapNamesOfPermissions: string[];
  isSuperAdmin: boolean;
  handleDeleteWorkerCompany: (workerId: string) => void;
}

const CompanyWorkerInfo: NextPage<
  CompanyWorkerInfoProps & ITranslatesProps & ISiteProps
> = ({
  item,
  index,
  mapNamesOfPermissions,
  isSuperAdmin,
  dispatch,
  siteProps,
  handleDeleteWorkerCompany,
}) => {
  const [showRemoveWorkerFromCompany, setShowRemoveWorkerFromCompany] =
    useState<boolean>(false);

  const handleShowRemoveWorkerFromCompany = () => {
    setShowRemoveWorkerFromCompany((prevState) => !prevState);
  };

  const isAdminCompany = item.permissions.some(
    (item) => item === EnumWorkerPermissions.admin
  );

  if (typeof item.userId !== "string" && typeof item.companyId === "string") {
    return (
      <>
        <RemoveWorkerFromCompany
          showRemoveWorkerFromCompany={showRemoveWorkerFromCompany}
          handleShowRemoveWorkerFromCompany={handleShowRemoveWorkerFromCompany}
          companyId={item.companyId}
          handleDeleteWorkerCompany={handleDeleteWorkerCompany}
          workerId={item._id}
        />
        <div className="ml-10 mr-10">
          <According
            title={`${item.userId.userDetails.name?.toLocaleUpperCase()} ${item.userId.userDetails.surname?.toLocaleUpperCase()}`}
            id={`according_searched_company_worker_${index}`}
            defaultIsOpen={false}
            marginTop={1}
            marginBottom={0}
            color={item.active ? "GREEN_DARK" : "RED_DARK"}
          >
            <div className="ml-10 mr-10">
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Imię i nazwisko: <span>${item.userId.userDetails.name?.toLocaleUpperCase()} ${item.userId.userDetails.surname?.toLocaleUpperCase()}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Użytkownik zaakceptował zaproszenie: <span>${item.active}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Specjalizacja: <span>${
                  !!item.specialization ? item.specialization : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Upoważnienia: <span>${mapNamesOfPermissions}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Data aktualizacji pracownika: <span>${
                  !!item?.updatedAt
                    ? getFullDateWithTime(new Date(item?.updatedAt))
                    : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`Data utworzenia pracownika: <span>${
                  !!item?.createdAt
                    ? getFullDateWithTime(new Date(item?.createdAt))
                    : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <div className="mt-10">
                <ButtonIcon
                  id="button_registration"
                  iconName="TrashIcon"
                  onClick={() => {}}
                  fullWidth
                  color="PRIMARY"
                >
                  Wyślij ponownie zaproszenie
                </ButtonIcon>
              </div>
              <div className="mt-5">
                <ButtonIcon
                  id="button_registration"
                  iconName="TrashIcon"
                  onClick={() => {}}
                  fullWidth
                  color="PRIMARY"
                >
                  Zmień uprawnienia
                </ButtonIcon>
              </div>
              {isSuperAdmin && (
                <>
                  {!isAdminCompany && (
                    <>
                      <div className="mt-5">
                        <ButtonIcon
                          id="button_registration"
                          iconName="TrashIcon"
                          onClick={() => {}}
                          fullWidth
                          color="SECOND"
                        >
                          Ustaw jako admin firmy
                        </ButtonIcon>
                      </div>
                      <div className="mt-5">
                        <ButtonIcon
                          id="button_registration"
                          iconName="TrashIcon"
                          onClick={handleShowRemoveWorkerFromCompany}
                          fullWidth
                          color="RED"
                        >
                          Usuń z firmy
                        </ButtonIcon>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </According>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default withTranslates(
  withSiteProps(CompanyWorkerInfo),
  "CompanyWorkerInfo"
);
