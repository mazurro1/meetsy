import {NextPage} from "next";
import {PageSegment, FetchData, TitlePage, ButtonIcon} from "@ui";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {updateEditCompany} from "@/redux/companys/actions";
import {useEffect} from "react";
import {withSiteProps, withCompanysProps} from "@hooks";
import type {ISiteProps, ICompanysProps} from "@hooks";
import type {CompanyProps} from "@/models/Company/company.model";

interface CompanyEditProps {
  company: null | CompanyProps;
}

const CompanyEdit: NextPage<ISiteProps & CompanyEditProps & ICompanysProps> = ({
  company,
  dispatch,
  editedCompany,
}) => {
  useEffect(() => {
    dispatch?.(updateEditCompany(company));
  }, [company]);

  console.log("editedCompany", editedCompany);

  return (
    <>
      {!!company && (
        <>
          <TitlePage color="SECOND">
            {company.companyDetails.name} <br />
            (edycja)
          </TitlePage>
          <PageSegment id="company_edit_page" maxWidth={400}>
            <div className="mt-20 text-center">
              <div className="">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  widthFull
                >
                  Dane firmy
                </ButtonIcon>
              </div>
              <div className="mt-10">
                <ButtonIcon
                  id=""
                  onClick={() => {}}
                  iconName="RefreshIcon"
                  widthFull
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
                >
                  Faktury
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

  if (!!!resultFetch?.data?.company) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  return {
    props: {company: resultFetch?.data?.company},
  };
};

export default withCompanysProps(withSiteProps(CompanyEdit));
