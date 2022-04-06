import {NextPage} from "next";
import {
  PageSegment,
  TitlePage,
  FetchData,
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
import {
  updateCompany,
  updateSelectedUserCompany,
} from "@/redux/companys/actions";
import {CompanyWorkerPropsLiveArray} from "@/models/CompanyWorker/companyWorker.model";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import ConfirmEmailAdressCompany from "@/components/PageComponents/AccountCompanysPage/ConfirmEmailAdressCompany";
import CompanyInformationAccording from "@/components/PageComponents/AccountCompanysPage/CompanyInformationAccording";

const CompanyPage: NextPage<ISiteProps & ITranslatesProps & ICompanysProps> = ({
  siteProps,
  texts,
  dispatch,
  userCompanys,
  router,
  selectedUserCompany,
}) => {
  const [selectedCompany, setSelectedCompany] =
    useState<SelectCreatedValuesProps | null>(null);
  const [allCompanys, setAllCompanys] = useState<SelectCreatedValuesProps[]>(
    []
  );
  const [activeEmailCompany, setActiveEmailCompany] = useState<boolean>(false);

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
          dispatch!(addAlertItem(texts!.errorFetchCompanys, "RED"));
        }
      },
    });
  }, []);

  useEffect(() => {
    const mapAllCompanys: SelectCreatedValuesProps[] = [];
    if (!!userCompanys) {
      for (const item of userCompanys) {
        if (typeof item.companyId !== "string") {
          const newItem: SelectCreatedValuesProps = {
            value: item.companyId!._id,
            label: !!item.companyId?.companyDetails.name
              ? item.companyId?.companyDetails.name.toUpperCase()
              : texts!.noNameCompany,
          };
          mapAllCompanys.push(newItem);
        }
      }
    }
    setAllCompanys(mapAllCompanys);
    if (mapAllCompanys.length > 0) {
      setSelectedCompany(mapAllCompanys[0]);
    }
  }, [userCompanys]);

  useEffect(() => {
    if (!!selectedCompany) {
      dispatch!(updateSelectedUserCompany(selectedCompany?.value));
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (!!selectedUserCompany) {
      if (typeof selectedUserCompany.companyId !== "string") {
        if (!!!selectedUserCompany.companyId?.companyDetails.emailIsConfirmed) {
          setActiveEmailCompany(true);
        } else {
          setActiveEmailCompany(false);
        }
      }
    }
  }, [selectedUserCompany]);

  const handleChangeCompany = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps;
    setSelectedCompany(savedValue);
  };

  const handleChangeActiveEmailCompany = () => {
    setActiveEmailCompany((prevState) => !prevState);
  };

  let isAdminCompany: boolean = false;
  let hasEmailAdresToConfirm: boolean = false;
  let hasPhoneToConfirm: boolean = false;
  let companyId: string | null = null;
  console.log(selectedUserCompany);
  if (!!selectedUserCompany) {
    isAdminCompany = selectedUserCompany.permissions.some((item) => {
      return item === EnumWorkerPermissions.admin;
    });

    if (typeof selectedUserCompany.companyId !== "string") {
      if (!!selectedUserCompany.companyId?._id) {
        companyId = selectedUserCompany.companyId?._id;
      }

      if (!!!selectedUserCompany.companyId!.companyDetails.emailIsConfirmed) {
        hasEmailAdresToConfirm = true;
      }

      if (!!!selectedUserCompany.companyId!.phoneDetails.isConfirmed) {
        hasPhoneToConfirm = true;
      }
    }
  }

  return (
    <PageSegment id="company_page" maxWidth={400}>
      <TitlePage>{texts!.companies}</TitlePage>
      <Paragraph marginBottom={0} marginTop={1} bold>
        {texts!.selectCompany}
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
      {!!selectedUserCompany && (
        <>
          {!!companyId && (
            <ConfirmEmailAdressCompany
              popupEnable={
                isAdminCompany && hasEmailAdresToConfirm && activeEmailCompany
              }
              handleShowConfirmNewEmailCompany={handleChangeActiveEmailCompany}
              companyId={companyId}
            />
          )}
          <CompanyInformationAccording
            selectedUserCompany={selectedUserCompany}
          />
          <div className="text-center">
            {isAdminCompany && hasEmailAdresToConfirm && (
              <div className="mb-10">
                <ButtonIcon
                  id="copy_company_url"
                  iconName="AtSymbolIcon"
                  widthFull
                  onClick={handleChangeActiveEmailCompany}
                  color="RED"
                >
                  {texts!.confirmEmailAdress}
                </ButtonIcon>
              </div>
            )}
            {isAdminCompany && hasPhoneToConfirm && !hasEmailAdresToConfirm && (
              <div className="mb-10">
                <ButtonIcon
                  id="copy_company_url"
                  iconName="PhoneIcon"
                  widthFull
                  onClick={() => {}}
                  color="RED"
                >
                  {texts!.confirmPhoneNumber}
                </ButtonIcon>
              </div>
            )}
            <div className="mb-10">
              <ButtonIcon
                id="company_url"
                iconName="GlobeAltIcon"
                widthFull
                onClick={() => {
                  if (typeof selectedUserCompany.companyId !== "string") {
                    router?.push(
                      `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${
                        selectedUserCompany.companyId!.companyContact.url
                      }`
                    );
                  }
                }}
              >
                {texts!.goToCompanyWebsite}
              </ButtonIcon>
            </div>
            <div className="">
              <ButtonIcon
                id="copy_company_url"
                iconName="LinkIcon"
                widthFull
                onClick={() => {
                  if (typeof selectedUserCompany.companyId !== "string") {
                    dispatch!(addAlertItem(texts!.copyLinkCompany, "PRIMARY"));
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${
                        selectedUserCompany.companyId!.companyContact.url
                      }`
                    );
                  }
                }}
              >
                {texts!.copyLinkToCompanyWebsite}
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
  withTranslates(withSiteProps(CompanyPage), "AccountCompanysPage")
);
