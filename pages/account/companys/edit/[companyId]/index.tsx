import {NextPage} from "next";
import {PageSegment, FetchData, TitlePage, ButtonIcon} from "@ui";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {updateEditCompany} from "@/redux/companys/actions";
import {useEffect, useState} from "react";
import {withSiteProps, withCompanysProps} from "@hooks";
import type {ISiteProps, ICompanysProps} from "@hooks";
import type {CompanyProps} from "@/models/Company/company.model";
import ChangeCompanyInformation from "@/components/PageComponents/CompanysEditPage/ChangeCompanyInformation";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import ChangeCompanyContact from "@/components/PageComponents/CompanysEditPage/ChangeCompanyContact";
import {CompanyPropsLive} from "@/models/Company/company.model";
import {CompanyWorkerPropsLive} from "@/models/CompanyWorker/companyWorker.model";
import ChangeCompanyEmail from "@/components/PageComponents/CompanysEditPage/ChangeCompanyEmail";
import ChangeCompanyPhone from "@/components/PageComponents/CompanysEditPage/ChangeCompanyPhone";
import EditCompanyWorkers from "@/components/PageComponents/CompanysEditPage/EditCompanyWorkers";
import {addAlertItem} from "@/redux/site/actions";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import AddFundsCompany from "@/components/PageComponents/CompanysEditPage/AddFundsCompany";
import PaymentsCompany from "@/components/PageComponents/CompanysEditPage/PaymentsCompany";

interface CompanyEditProps {
  company: CompanyProps;
  companyWorker: CompanyWorkerProps;
}

export interface UpdateCompanyWorker {
  objectName: string;
  value: any;
}

const CompanyEdit: NextPage<ISiteProps & CompanyEditProps & ICompanysProps> = ({
  company,
  dispatch,
  editedCompany,
  companyWorker,
  editedCompanyWorker,
  siteProps,
}) => {
  const [companyWorkers, setCompanyWorkers] = useState<CompanyWorkerProps[]>(
    []
  );

  useEffect(() => {
    if (!!company && !!companyWorker) {
      dispatch?.(updateEditCompany(company, companyWorker));
    }
  }, [company, companyWorker]);

  const handleAddCompanyWorkerToAll = (workerProps: CompanyWorkerProps) => {
    if (!!workerProps) {
      setCompanyWorkers((prevState) => {
        const allCompanyworkers = [...prevState, workerProps];
        return allCompanyworkers;
      });
    }
  };

  const handleRemoveCompanyWorkerFromAll = (workerId: string) => {
    if (!!workerId) {
      setCompanyWorkers((prevState) => {
        const allCompanyworkers = prevState.filter(
          (item) => item._id !== workerId
        );
        return allCompanyworkers;
      });
    }
  };

  const handleUpdateCompanyWorkerProps = (
    workerId: string,
    valuesToUpdate: UpdateCompanyWorker[]
  ) => {
    if (!!workerId) {
      setCompanyWorkers((prevState) => {
        const findIndexWorker = prevState.findIndex(
          (item) => item._id === workerId
        );

        for (const itemValueToUpdate of valuesToUpdate) {
          if (
            typeof itemValueToUpdate.value !== "undefined" &&
            !!itemValueToUpdate.objectName
          ) {
            if (!!prevState[findIndexWorker]) {
              if (
                // @ts-ignore
                typeof prevState[findIndexWorker][
                  itemValueToUpdate.objectName
                ] !== "undefined"
              ) {
                // @ts-ignore
                prevState[findIndexWorker][itemValueToUpdate.objectName] =
                  itemValueToUpdate.value;
              }
            }
          }
        }

        return prevState;
      });
    }
  };

  let userIsAdmin = false;
  let userHasAccessToManageCompanyInformations = false;
  let userHasAccessToManageWorkers = false;
  let companyName = "";
  let companyNip = 0;
  let companyId = "";
  let companyPhone: number = 0;
  let companyPhoneToConfirm: number = 0;
  let companyRegionalCode: number = 0;
  let companyRegionalCodeToConfirm: number = 0;
  let companyEmail: string = "";
  let companyEmailToConfirm: string = "";
  let dateSendAgainCompanySMS: Date | null = null;
  let companyBanned: boolean = false;

  if (!!editedCompany) {
    if (!!editedCompany.banned) {
      companyBanned = editedCompany.banned;
    }

    if (!!editedCompany.email) {
      companyEmail = editedCompany.email;
    }

    if (!!editedCompany.companyDetails.toConfirmEmail) {
      companyEmailToConfirm = editedCompany.companyDetails.toConfirmEmail;
    }

    if (!!editedCompany?.companyDetails.name) {
      companyName = editedCompany?.companyDetails.name.toUpperCase();
    }
    if (!!editedCompany?.companyDetails.nip) {
      companyNip = editedCompany?.companyDetails.nip;
    }

    if (!!editedCompany._id) {
      companyId = editedCompany._id;
    }

    if (!!editedCompany.phoneDetails.number) {
      companyPhone = editedCompany.phoneDetails.number;
    }

    if (!!editedCompany.phoneDetails.toConfirmNumber) {
      companyPhoneToConfirm = editedCompany.phoneDetails.toConfirmNumber;
    }

    if (!!editedCompany.phoneDetails.regionalCode) {
      companyRegionalCode = editedCompany.phoneDetails.regionalCode;
    }

    if (!!editedCompany.phoneDetails.toConfirmRegionalCode) {
      companyRegionalCodeToConfirm =
        editedCompany.phoneDetails.toConfirmRegionalCode;
    }

    if (!!editedCompany.phoneDetails.dateSendAgainSMS) {
      dateSendAgainCompanySMS = new Date(
        editedCompany.phoneDetails.dateSendAgainSMS
      );
    }
  }

  if (!!editedCompanyWorker) {
    userHasAccessToManageCompanyInformations =
      editedCompanyWorker.permissions.some(
        (item) => item === EnumWorkerPermissions.manageCompanyInformations
      );

    userIsAdmin = editedCompanyWorker.permissions.some(
      (item) => item === EnumWorkerPermissions.admin
    );

    userHasAccessToManageWorkers = editedCompanyWorker.permissions.some(
      (item) => item === EnumWorkerPermissions.manageWorkers
    );
  }

  useEffect(() => {
    if (!!companyId) {
      FetchData({
        url: "/api/companys/edit/workers",
        method: "GET",
        dispatch: dispatch,
        language: siteProps?.language,
        companyId: companyId,
        disabledLoader: true,
        callback: (data) => {
          if (data.success) {
            if (!!data.data.workers) {
              const resultData = CompanyWorkerPropsLive.array().safeParse(
                data.data.workers
              );
              if (resultData.success) {
                setCompanyWorkers(data.data.workers);
              }
            }
          } else {
            dispatch!(
              addAlertItem("Błąd podczas pobierania pracowników", "RED")
            );
          }
        },
      });
    }
  }, [companyId]);

  return (
    <>
      {!!company && (
        <>
          <TitlePage color={companyBanned ? "RED" : "SECOND"}>
            {companyBanned
              ? `${company.companyDetails.name} - konto zablokowane!`
              : company.companyDetails.name}
          </TitlePage>
          <PageSegment id="company_edit_page" maxWidth={400}>
            <div className="mt-20">
              {(userHasAccessToManageCompanyInformations || userIsAdmin) && (
                <>
                  <ChangeCompanyInformation
                    companyName={companyName}
                    companyNip={companyNip}
                    companyId={companyId}
                    companyBanned={companyBanned}
                  />
                  <ChangeCompanyContact
                    companyContact={editedCompany?.companyContact}
                    companyId={companyId}
                    companyBanned={companyBanned}
                  />
                </>
              )}
              {userIsAdmin && (
                <>
                  <ChangeCompanyEmail
                    companyId={companyId}
                    companyEmail={companyEmail}
                    companyEmailToConfirm={companyEmailToConfirm}
                    companyBanned={companyBanned}
                  />
                  <ChangeCompanyPhone
                    companyId={companyId}
                    companyPhone={companyPhone}
                    companyRegionalCode={companyRegionalCode}
                    companyPhoneToConfirm={companyPhoneToConfirm}
                    companyRegionalCodeToConfirm={companyRegionalCodeToConfirm}
                    dateSendAgainCompanySMS={dateSendAgainCompanySMS}
                    companyBanned={companyBanned}
                  />
                </>
              )}
              {(userIsAdmin || userHasAccessToManageWorkers) && (
                <EditCompanyWorkers
                  companyWorkers={companyWorkers}
                  userIsAdmin={userIsAdmin}
                  companyId={companyId}
                  handleAddCompanyWorkerToAll={handleAddCompanyWorkerToAll}
                  handleRemoveCompanyWorkerFromAll={
                    handleRemoveCompanyWorkerFromAll
                  }
                  handleUpdateCompanyWorkerProps={
                    handleUpdateCompanyWorkerProps
                  }
                  companyBanned={companyBanned}
                />
              )}
              {userIsAdmin && (
                <>
                  <AddFundsCompany
                    companyId={companyId}
                    companyBanned={companyBanned}
                  />
                  <PaymentsCompany
                    companyId={companyId}
                    companyBanned={companyBanned}
                  />
                </>
              )}

              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Promocje
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Pieczątki
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Happy hours
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Last minute
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Ustawienia rezerwacji
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Dni otwarte
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Dni wolne
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Galeria zdjęć
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Powiadomienia
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Statystyki
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Środki na koncie
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Zawieś działalność
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  fullWidth
                  disabled
                >
                  Usuń działalność
                </ButtonIcon>
              </div>
            </div>
          </PageSegment>
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params, req} = context;
  const session = await getSession({req: req});
  if (!!!session) {
    return {
      props: {...params},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  let companyId: string = "";
  if (!!params?.companyId) {
    if (typeof params.companyId === "string") {
      companyId = params.companyId;
    }
  }

  const resultFetch = await FetchData({
    url: `${process.env.NEXTAUTH_URL}/api/companys/edit`,
    method: "GET",
    userEmail: session.user?.email,
    companyId: companyId,
    ssr: true,
    async: true,
  });

  if (!resultFetch?.success) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  if (!!!resultFetch?.data?.company || !!!resultFetch?.data?.companyWorker) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  const resultDataCompany = CompanyPropsLive.safeParse(
    resultFetch.data.company
  );
  const resultDataCompanyWorker = CompanyWorkerPropsLive.safeParse(
    resultFetch.data.companyWorker
  );

  if (!resultDataCompany.success || !resultDataCompanyWorker.success) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  return {
    props: {
      company: resultFetch.data.company,
      companyWorker: resultFetch.data.companyWorker,
    },
  };
};

export default withCompanysProps(withSiteProps(CompanyEdit));
