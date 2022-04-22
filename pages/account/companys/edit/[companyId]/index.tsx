import {NextPage} from "next";
import {PageSegment, FetchData, TitlePage, ButtonIcon} from "@ui";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {updateEditCompany} from "@/redux/companys/actions";
import {useEffect} from "react";
import {withSiteProps, withCompanysProps} from "@hooks";
import type {ISiteProps, ICompanysProps} from "@hooks";
import type {CompanyProps} from "@/models/Company/company.model";
import ChangeCompanyInformation from "@/components/PageComponents/CompanysEditPage/ChangeCompanyInformation";
import {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import ChangeCompanyContact from "@/components/PageComponents/CompanysEditPage/ChangeCompanyContact";
import {CompanyPropsLive} from "@/models/Company/company.model";
import {CompanyWorkerPropsLive} from "@/models/CompanyWorker/companyWorker.model";
import ChangeCompanyEmail from "@/components/PageComponents/CompanysEditPage/ChangeCompanyEmail";

interface CompanyEditProps {
  company: CompanyProps;
  companyWorker: CompanyWorkerProps;
}

const CompanyEdit: NextPage<ISiteProps & CompanyEditProps & ICompanysProps> = ({
  company,
  dispatch,
  editedCompany,
  companyWorker,
  editedCompanyWorker,
}) => {
  useEffect(() => {
    if (!!company && !!companyWorker) {
      dispatch?.(updateEditCompany(company, companyWorker));
    }
  }, [company, companyWorker]);

  let userIsAdmin = false;
  let userHasAccessToManageCompanyInformations = false;
  let companyName = "";
  let companyNip = 0;
  let companyId = "";
  let phoneNumber: number = 0;
  let regionalCode: number = 0;
  let companyEmail: string = "";
  let companyEmailToConfirm: string = "";

  if (!!editedCompany) {
    if (!!editedCompany.email) {
      companyEmail = editedCompany.email;
    }

    if (!!editedCompany.companyDetails.toConfirmEmail) {
      companyEmailToConfirm = editedCompany.companyDetails.toConfirmEmail;
    }

    if (!!editedCompany?.companyDetails.name) {
      companyName = editedCompany?.companyDetails.name;
    }
    if (!!editedCompany?.companyDetails.nip) {
      companyNip = editedCompany?.companyDetails.nip;
    }

    if (!!editedCompany._id) {
      companyId = editedCompany._id;
    }

    if (editedCompany.phoneDetails.number) {
      phoneNumber = editedCompany.phoneDetails.number;
    }
    if (editedCompany.phoneDetails.regionalCode) {
      regionalCode = editedCompany.phoneDetails.regionalCode;
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
  }

  return (
    <>
      {!!company && (
        <>
          <TitlePage color="SECOND">{company.companyDetails.name}</TitlePage>
          <PageSegment id="company_edit_page" maxWidth={400}>
            <div className="mt-20">
              {(userHasAccessToManageCompanyInformations || userIsAdmin) && (
                <>
                  <ChangeCompanyInformation
                    companyName={companyName}
                    companyNip={companyNip}
                    companyId={companyId}
                  />
                  <ChangeCompanyContact
                    companyContact={editedCompany?.companyContact}
                    companyId={companyId}
                  />
                </>
              )}
              {userIsAdmin && (
                <>
                  <ChangeCompanyEmail
                    companyId={companyId}
                    companyEmail={companyEmail}
                    companyEmailToConfirm={companyEmailToConfirm}
                  />
                  <div className="mt-10">
                    <ButtonIcon
                      id=""
                      onClick={() => {}}
                      iconName="RefreshIcon"
                      fullWidth
                      disabled
                    >
                      Numer telefonu
                    </ButtonIcon>
                  </div>
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
                  Pracownicy
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
                  Faktury
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
