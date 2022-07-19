import {NextPage} from "next";
import {
  PageSegment,
  Form,
  FetchData,
  InputIcon,
  TitlePage,
  According,
  Paragraph,
  ButtonIcon,
  AccordingItem,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {EnumUserPermissions} from "@/models/User/user.model";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import type {CompanyProps} from "@/models/Company/company.model";
import {useState} from "react";
import {showValidPostalCode, getFullDateWithTime} from "@functions";
import {getAllNamesOfWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import BanCompany from "@/components/PageComponents/AdminCompanys/BanCompany";
import AddWorkerToCompany from "@/components/PageComponents/AdminCompanys/AddWorkerToCompany";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import CompanyWorkerInfo from "@/components/PageComponents/AdminCompanys/CompanyWorkerInfo";

export interface UpdateCompanyProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}

const AdminCompanysPage: NextPage<
  ISiteProps & ITranslatesProps & IUserProps
> = ({siteProps, texts, user, dispatch, isMobile}) => {
  const [activeAccording, setActiveAccording] = useState<boolean>(false);
  const [companyData, setComapnyData] = useState<null | CompanyProps>(null);
  const [allCompanyWorkers, setAllCompanyWorkers] = useState<
    CompanyWorkerProps[]
  >([]);
  const [showBanCompany, setShowBanCompany] = useState<boolean>(false);
  const [showAddWorkerToCompany, setShowAddWorkerToCompany] =
    useState<boolean>(false);

  const handleShowBanCompany = () => {
    setShowBanCompany((prevState) => !prevState);
  };

  const handleShowAddWorkerToCompany = () => {
    setShowAddWorkerToCompany((prevState) => !prevState);
  };

  const handleAddCompany = (newWorker: CompanyWorkerProps) => {
    setAllCompanyWorkers((prevState: CompanyWorkerProps[]) => {
      return [...prevState, newWorker];
    });
  };

  const handleDeleteWorkerCompany = (workerId: string) => {
    setAllCompanyWorkers((prevState: CompanyWorkerProps[]) => {
      const filterWorkers = prevState.filter((item) => item._id !== workerId);
      return filterWorkers;
    });
  };

  const handleUpdateAllWorkers = (newWorkers: CompanyWorkerProps[]) => {
    setAllCompanyWorkers(newWorkers);
  };

  const handleUpdateCompanyWorker = (
    updatedProps: UpdateCompanyProps[],
    workerId: string
  ) => {
    if (!!updatedProps && !!workerId) {
      setAllCompanyWorkers((prevState) => {
        const valuesToChange: UpdateCompanyProps[] = updatedProps;

        const indexCompanyWorker = prevState.findIndex(
          (item) => item._id === workerId
        );
        if (indexCompanyWorker >= 0) {
          valuesToChange.forEach((item) => {
            if (typeof item.value !== "undefined") {
              if (!!item.folder) {
                // @ts-ignore
                if (!!prevState[indexCompanyWorker][item.folder]) {
                  if (
                    // @ts-ignore
                    typeof prevState[indexCompanyWorker][item.folder][
                      item.field
                    ] !== "undefined"
                  ) {
                    // @ts-ignore
                    prevState[indexCompanyWorker][item.folder][item.field] =
                      item.value;
                  }
                }
              } else if (!!item.field) {
                if (
                  // @ts-ignore
                  typeof prevState[indexCompanyWorker][item.field] !==
                  "undefined"
                ) {
                  // @ts-ignore
                  prevState[indexCompanyWorker][item.field] = item.value;
                }
              }
            }
          });
        }

        return prevState;
      });
    }
  };

  const handleUpdateCompany = (updatedProps: UpdateCompanyProps[]) => {
    if (!!updatedProps) {
      setComapnyData((prevState) => {
        const valuesToChange: UpdateCompanyProps[] = updatedProps;
        valuesToChange.forEach((item) => {
          if (typeof item.value !== "undefined") {
            if (!!item.folder) {
              // @ts-ignore
              if (!!prevState[item.folder]) {
                if (
                  // @ts-ignore
                  typeof prevState[item.folder][item.field] !== "undefined"
                ) {
                  // @ts-ignore
                  prevState[item.folder][item.field] = item.value;
                }
              }
            } else if (!!item.field) {
              // @ts-ignore
              if (typeof prevState[item.field] !== "undefined") {
                // @ts-ignore
                prevState[item.field] = item.value;
              }
            }
          }
        });

        return prevState;
      });
    }
  };

  // const emailAdress = texts!.inputCodeEmail;
  const emailAdress = "Adres e-mail firmy";
  let language: "pl" | "en" = "pl";
  if (siteProps?.language) {
    language = siteProps?.language;
  }

  let isSuperAdmin = false;
  if (!!user) {
    if (!!user?.permissions) {
      isSuperAdmin = user.permissions.some(
        (item) => item === EnumUserPermissions.superAdmin
      );
    }
  }

  const handleSearchCompanyAdmin = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find((item) => item.placeholder === emailAdress);
      if (!!findEmail) {
        if (typeof findEmail.value === "string") {
          setActiveAccording(false);
          FetchData({
            url: "/api/admin/companys",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              companyEmail: findEmail.value.toLowerCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (!!data?.data?.company) {
                  setComapnyData(data.data.company);
                  setActiveAccording(true);
                } else {
                  setComapnyData(null);
                  setActiveAccording(false);
                }
                if (!!data?.data?.companyWorkers) {
                  setAllCompanyWorkers(data.data.companyWorkers);
                }
              } else {
                setComapnyData(null);
                setActiveAccording(false);
              }
            },
          });
        }
      }
    }
  };

  const mapAllCompanyWorkers = allCompanyWorkers.map((item, index) => {
    if (typeof item.userId !== "string") {
      const valuePermissions = getAllNamesOfWorkerPermissions({
        permissions: item.permissions,
        language: language,
      });
      const mapNamesOfPermissions = valuePermissions.map((itemPermission) => {
        return " " + itemPermission.name;
      });

      return (
        <CompanyWorkerInfo
          key={index}
          index={index}
          mapNamesOfPermissions={mapNamesOfPermissions}
          isSuperAdmin={isSuperAdmin}
          item={item}
          handleDeleteWorkerCompany={handleDeleteWorkerCompany}
          handleUpdateAllWorkers={handleUpdateAllWorkers}
          handleUpdateCompanyWorker={handleUpdateCompanyWorker}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div>
      {!!companyData && (
        <>
          <BanCompany
            showBanCompany={showBanCompany}
            handleShowBanCompany={handleShowBanCompany}
            companyData={companyData}
            companyBanned={companyData.banned}
            handleUpdateCompany={handleUpdateCompany}
          />
          <AddWorkerToCompany
            showAddWorkerToCompany={showAddWorkerToCompany}
            handleShowAddWorkerToCompany={handleShowAddWorkerToCompany}
            companyData={companyData}
            handleAddCompany={handleAddCompany}
          />
        </>
      )}
      <PageSegment id="admin_companys_page" maxWidth={600}>
        <TitlePage>Wyszukaj firmę</TitlePage>
        <Form
          id="admin_search_company"
          onSubmit={handleSearchCompanyAdmin}
          buttonText={"Wyszukaj firmę"}
          buttonColor="PRIMARY"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SearchIcon"
          buttonsFullWidth={isMobile}
          validation={[
            {
              placeholder: emailAdress,
              isEmail: true,
            },
          ]}
        >
          <InputIcon
            placeholder={emailAdress}
            validTextGenerate="REQUIRED"
            type="email"
            id="search_email_adres_company_admin_page_input"
            iconName="AtSymbolIcon"
          />
        </Form>
        {!!companyData && (
          <According
            title={
              !!companyData?.companyDetails?.name
                ? `Firma: ${companyData?.companyDetails?.name.toUpperCase()}`
                : "Brak znalezionej firmy"
            }
            id="according_searched_company"
            defaultIsOpen={false}
            active={activeAccording}
            setActive={setActiveAccording}
          >
            {!!companyData && (
              <AccordingItem
                id="according_searched_company_information"
                index={0}
                userSelect
              >
                <div className="ml-10 mr-10">
                  <div>
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Id firmy: <span>${companyData._id}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Nazwa firmy: <span>${companyData.companyDetails.name?.toLocaleUpperCase()}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Konto zablokowane: <span>${companyData.banned}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Email: <span>${companyData.email}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Adres email jest potwierdzony: <span>${companyData.companyDetails.emailIsConfirmed}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Email do potwierdzenia: <span>${companyData.companyDetails.toConfirmEmail}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Nip: <span>${companyData.companyDetails.nip}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Państwo: <span>${companyData.companyContact.country}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Kod pocztowy: <span>${showValidPostalCode(
                        companyData.companyContact.postalCode
                      )}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Miasto: <span>${companyData.companyContact.city.placeholder}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Dzielnica: <span>${companyData.companyContact.district.placeholder}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Ulica: <span>${companyData.companyContact.street.placeholder}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Link: <span>${companyData.companyContact.url}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Lokalizacja na mapach: <span>lat: ${companyData.companyContact.location?.lat}, lng: ${companyData.companyContact.location?.lng}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Numer telefonu: <span>+${companyData.phoneDetails.regionalCode} ${companyData.phoneDetails.number}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Numer telefonu jest potwierdzony: <span>${companyData.phoneDetails.isConfirmed}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Numer telefonu do potwierdzenia: <span>+${companyData.phoneDetails.toConfirmRegionalCode} ${companyData.phoneDetails.toConfirmNumber}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Data ostatniego wysłanego SMS do potwierdzenia numeru telefonu: <span>${
                        !!companyData.phoneDetails.dateSendAgainSMS
                          ? getFullDateWithTime(
                              new Date(
                                companyData.phoneDetails.dateSendAgainSMS
                              )
                            )
                          : "-"
                      }</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Data aktualizacji firmy: <span>${
                        !!companyData?.updatedAt
                          ? getFullDateWithTime(
                              new Date(companyData?.updatedAt)
                            )
                          : "-"
                      }</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Data utworzenia firmy: <span>${
                        !!companyData?.createdAt
                          ? getFullDateWithTime(
                              new Date(companyData?.createdAt)
                            )
                          : "-"
                      }</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <div className="mt-5">
                      <ButtonIcon
                        id="button_add_worker_to_company"
                        iconName="UserAddIcon"
                        onClick={handleShowAddWorkerToCompany}
                        fullWidth
                        color="PRIMARY"
                      >
                        Dodaj pracownika do firmy
                      </ButtonIcon>
                    </div>
                    <div className="mt-5">
                      <ButtonIcon
                        id="button_ban_company"
                        iconName="BanIcon"
                        onClick={handleShowBanCompany}
                        fullWidth
                        color="RED"
                      >
                        {!!companyData.banned
                          ? "Odbanuj firmę"
                          : "Zablokuj firmę"}
                      </ButtonIcon>
                    </div>
                  </div>
                  <div className="ml-10 mr-10">
                    <According
                      title={"Pracownicy"}
                      id="according_searched_company_workers"
                      defaultIsOpen={true}
                      color="PRIMARY_DARK"
                    >
                      {!!companyData && <div>{mapAllCompanyWorkers}</div>}
                    </According>
                  </div>
                </div>
              </AccordingItem>
            )}
          </According>
        )}
      </PageSegment>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(withUserProps(AdminCompanysPage)),
  "AdminPage"
);
