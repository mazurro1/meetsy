import {NextPage} from "next";
import {
  PageSegment,
  TitlePage,
  FetchData,
  According,
  AccordingItem,
  Paragraph,
  ButtonIcon,
} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, ICompanysProps} from "@hooks";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {useEffect} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {updateCompany} from "@/redux/companys/actions";
import {CompanyWorkerPropsLiveArray} from "@/models/CompanyWorker/companyWorker.model";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import {getFullDateWithTime} from "@functions";

const CompanyPage: NextPage<ISiteProps & ITranslatesProps & ICompanysProps> = ({
  siteProps,
  texts,
  dispatch,
  userCompanys,
  router,
}) => {
  useEffect(() => {
    FetchData({
      url: "/api/companys",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: false,
      callback: (data) => {
        if (data.success) {
          if (!!data.data.userCompanys) {
            const resultData = CompanyWorkerPropsLiveArray.safeParse(
              data.data.userCompanys
            );
            if (!resultData.success) {
              console.warn(resultData.error);
            }
            dispatch!(updateCompany(data.data.userCompanys));
          }
        } else {
          dispatch!(addAlertItem("Błąd podczas pobierania firm", "RED"));
        }
      },
    });
  }, []);

  const handleEditCompany = () => {};

  const mapCompanys = userCompanys?.map((item, index) => {
    let companyName: string = "Error";
    let companyEmailOrPhoneToVerified: boolean = false;

    const isAdmin = item.permissions.some(
      (item) => item === EnumWorkerPermissions.admin
    );
    const hasAccessToEdit = item.permissions.some(
      (item) => item === EnumWorkerPermissions.manageCompanyInformations
    );
    const validHandleEdit =
      isAdmin || hasAccessToEdit ? {handleEdit: handleEditCompany} : {};

    let contentCompany = null;
    if (typeof item.companyId !== "string") {
      if (!!item.companyId!.companyDetails.name) {
        companyName = item.companyId!.companyDetails.name?.toUpperCase();
      }

      if (
        (!!!item.companyId!.companyDetails.emailIsConfirmed ||
          !!!item.companyId!.phoneDetails.isConfirmed) &&
        isAdmin
      ) {
        companyEmailOrPhoneToVerified = true;
      }
      contentCompany = (
        <>
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Miasto: <span>${item.companyId!.companyContact.postalCode.toUpperCase()}, ${item.companyId!.companyContact.city.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Dzielnica: <span>${item.companyId!.companyContact.district.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Ulica: <span>${item.companyId!.companyContact.street.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Numer telefonu: <span>+${
              item.companyId!.phoneDetails.regionalCode
            } ${item.companyId!.phoneDetails.number}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Nip: <span>${
              item.companyId!.companyDetails.nip
            }</span>`}
          />
          {!!item.companyId!.updatedAt && isAdmin && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`Ostatnia aktualizacja: <span>${getFullDateWithTime(
                new Date(item.companyId!.updatedAt)
              )}</span>`}
            />
          )}
          {!!item.companyId!.createdAt && isAdmin && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`Utworzono: <span>${getFullDateWithTime(
                new Date(item.companyId!.createdAt)
              )}</span>`}
            />
          )}
          {!!!item.companyId!.companyDetails.emailIsConfirmed && isAdmin && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="RED_DARK"
              dangerouslySetInnerHTML={`<span>Adres email jest niepotwierdzony</span>`}
            />
          )}
          {!!!item.companyId!.phoneDetails.isConfirmed && isAdmin && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="RED_DARK"
              dangerouslySetInnerHTML={`<span>Numer telefonu jest niepotwierdzony</span>`}
            />
          )}
          <div className="flex-center-center mt-10">
            <ButtonIcon
              id="copy_company_url"
              iconName="LinkIcon"
              fontSize="SMALL"
              onClick={() => {
                if (typeof item.companyId !== "string") {
                  dispatch!(
                    addAlertItem(
                      "Skopiowano link do strony internetowej",
                      "PRIMARY"
                    )
                  );
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${
                      item.companyId!.companyContact.url
                    }`
                  );
                }
              }}
            >
              Kopiuj link do strony firmowej
            </ButtonIcon>
          </div>
        </>
      );
    }

    return (
      <According
        id="according_user_companys"
        title={companyName}
        marginTop={0}
        key={index}
        color={companyEmailOrPhoneToVerified ? "RED" : "PRIMARY"}
      >
        <AccordingItem
          id={`according_user_companys_${index}`}
          index={index}
          {...validHandleEdit}
          userSelect
        >
          {contentCompany}
        </AccordingItem>
      </According>
    );
  });

  return (
    <PageSegment id="company_page" maxWidth={600}>
      <TitlePage>Firmy</TitlePage>
      {mapCompanys}
    </PageSegment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});
  if (!!!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default withCompanysProps(
  withTranslates(withSiteProps(CompanyPage), "HomePage")
);
