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
                <ChangeCompanyInformation />
              )}

              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  widthFull
                  disabled
                >
                  Dane kontaktowe
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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
                  widthFull
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

  return {
    props: {
      company: resultFetch?.data?.company,
      companyWorker: resultFetch?.data?.companyWorker,
    },
  };
};

export default withCompanysProps(withSiteProps(CompanyEdit));
