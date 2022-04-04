import {NextPage} from "next";
import {
  PageSegment,
  TitlePage,
  FetchData,
  According,
  AccordingItem,
  Paragraph,
  ButtonIcon,
  SelectCreated,
} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, ICompanysProps} from "@hooks";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {useEffect, useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {updateCompany} from "@/redux/companys/actions";
import {CompanyWorkerPropsLiveArray} from "@/models/CompanyWorker/companyWorker.model";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import {getFullDateWithTime} from "@functions";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";

const CompanyPage: NextPage<ISiteProps & ITranslatesProps & ICompanysProps> = ({
  siteProps,
  texts,
  dispatch,
  userCompanys,
  router,
}) => {
  const [selectedCompany, setSelectedCompany] =
    useState<SelectCreatedValuesProps | null>(null);
  const [allCompanys, setAllCompanys] = useState<SelectCreatedValuesProps[]>(
    []
  );

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

  useEffect(() => {
    const mapAllCompanys = userCompanys?.map((item, index) => {
      if (typeof item.companyId !== "string") {
        const newItem: SelectCreatedValuesProps = {
          value: !!item.companyId?._id ? item.companyId?._id : index,
          label: !!item.companyId?.companyDetails.name
            ? item.companyId?.companyDetails.name.toUpperCase()
            : "none",
        };
        return newItem;
      } else {
        return {
          value: "",
          label: "",
        };
      }
    });
    if (!!mapAllCompanys) {
      setAllCompanys(mapAllCompanys);
      if (mapAllCompanys.length > 0) {
        setSelectedCompany(mapAllCompanys[0]);
      }
    }
  }, [userCompanys]);

  const handleChangeCompany = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps;
    setSelectedCompany(savedValue);
  };

  const handleEditCompany = () => {};

  const findCompany = userCompanys?.find((item) => {
    if (typeof item.companyId !== "string" && !!selectedCompany) {
      return item.companyId?._id === selectedCompany.value;
    } else {
      return false;
    }
  });

  let isAdminCompany: boolean = false;
  let hasAccessToEdit: boolean = false;
  let companyEmailOrPhoneToVerified: boolean = false;
  let validHandleEdit = {};
  let contentCompany = null;

  if (!!findCompany) {
    let companyName: string = "Error";

    isAdminCompany = findCompany.permissions.some((item) => {
      return item === EnumWorkerPermissions.admin;
    });

    hasAccessToEdit = findCompany.permissions.some(
      (item) => item === EnumWorkerPermissions.manageCompanyInformations
    );

    validHandleEdit =
      isAdminCompany || hasAccessToEdit ? {handleEdit: handleEditCompany} : {};

    if (typeof findCompany.companyId !== "string") {
      if (!!findCompany.companyId!.companyDetails.name) {
        companyName = findCompany.companyId!.companyDetails.name?.toUpperCase();
      }

      if (
        (!!!findCompany.companyId!.companyDetails.emailIsConfirmed ||
          !!!findCompany.companyId!.phoneDetails.isConfirmed) &&
        isAdminCompany
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
            dangerouslySetInnerHTML={`Nazwa: <span>${companyName}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Miasto: <span>${findCompany.companyId!.companyContact.postalCode.toUpperCase()}, ${findCompany.companyId!.companyContact.city.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Dzielnica: <span>${findCompany.companyId!.companyContact.district.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Ulica: <span>${findCompany.companyId!.companyContact.street.placeholder.toUpperCase()}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Numer telefonu: <span>+${
              findCompany.companyId!.phoneDetails.regionalCode
            } ${findCompany.companyId!.phoneDetails.number}</span>`}
          />
          <Paragraph
            marginTop={0}
            marginBottom={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Nip: <span>${
              findCompany.companyId!.companyDetails.nip
            }</span>`}
          />
          {!!findCompany.companyId!.updatedAt && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`Ostatnia aktualizacja: <span>${getFullDateWithTime(
                new Date(findCompany.companyId!.updatedAt)
              )}</span>`}
            />
          )}
          {!!findCompany.companyId!.createdAt && isAdminCompany && (
            <Paragraph
              marginTop={0}
              marginBottom={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`Utworzono: <span>${getFullDateWithTime(
                new Date(findCompany.companyId!.createdAt)
              )}</span>`}
            />
          )}
          {!!!findCompany.companyId!.companyDetails.emailIsConfirmed &&
            isAdminCompany && (
              <Paragraph
                marginTop={0}
                marginBottom={0}
                spanBold
                spanColor="RED_DARK"
                dangerouslySetInnerHTML={`<span>Adres email jest niepotwierdzony</span>`}
              />
            )}
          {!!!findCompany.companyId!.phoneDetails.isConfirmed &&
            isAdminCompany && (
              <Paragraph
                marginTop={0}
                marginBottom={0}
                spanBold
                spanColor="RED_DARK"
                dangerouslySetInnerHTML={`<span>Numer telefonu jest niepotwierdzony</span>`}
              />
            )}
        </>
      );
    }
  }

  return (
    <PageSegment id="company_page" maxWidth={400}>
      <TitlePage>Firmy</TitlePage>
      <Paragraph marginBottom={0} bold>
        Wybierz firmę
      </Paragraph>
      <div className="flex-center-center mb-10 ">
        <SelectCreated
          options={allCompanys}
          value={selectedCompany}
          handleChange={handleChangeCompany}
          isMulti={false}
          deleteItem={false}
          deleteLastItem={false}
          isClearable={false}
          color="GREY"
          width={400}
        />
      </div>
      {!!findCompany && (
        <>
          {(isAdminCompany || hasAccessToEdit) && (
            <div className="flex-center-center mb-10 mt-20">
              <According
                id="according_user_companys"
                title={"Dane firmy"}
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
          <div className="text-center">
            <ButtonIcon
              id="copy_company_url"
              iconName="GlobeAltIcon"
              widthFull
              onClick={() => {
                if (typeof findCompany.companyId !== "string") {
                  router?.push(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${
                      findCompany.companyId!.companyContact.url
                    }`
                  );
                }
              }}
            >
              Przejdz do strony firmowej
            </ButtonIcon>
            <div className="mt-10">
              <ButtonIcon
                id="copy_company_url"
                iconName="LinkIcon"
                widthFull
                onClick={() => {
                  if (typeof findCompany.companyId !== "string") {
                    dispatch!(
                      addAlertItem(
                        "Skopiowano link do strony internetowej",
                        "PRIMARY"
                      )
                    );
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${
                        findCompany.companyId!.companyContact.url
                      }`
                    );
                  }
                }}
              >
                Kopiuj link do strony firmowej
              </ButtonIcon>
            </div>
          </div>
        </>
      )}
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
