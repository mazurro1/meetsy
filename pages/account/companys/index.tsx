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
import ConfirmPhoneCompany from "@/components/PageComponents/AccountCompanysPage/ConfirmPhoneCompany";
import CompanyResetPhoneNumber from "@/components/PageComponents/AccountCompanysPage/CompanyResetPhoneNumber";
import {sortStringsItemsInArray} from "@functions";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import ConfirmNewEmailAdressCompany from "@/components/PageComponents/AccountCompanysPage/ConfirmNewEmailAdressCompany";

interface CompanyPageProps {
  fetchedUserCompanys: CompanyWorkerProps[];
}

const CompanyPage: NextPage<
  ISiteProps & ITranslatesProps & ICompanysProps & CompanyPageProps
> = ({
  siteProps,
  texts,
  dispatch,
  userCompanys,
  router,
  selectedUserCompany,
  fetchedUserCompanys,
}) => {
  const [selectedCompany, setSelectedCompany] =
    useState<SelectCreatedValuesProps | null>(null);
  const [allCompanys, setAllCompanys] = useState<SelectCreatedValuesProps[]>(
    []
  );
  const [activeEmailCompany, setActiveEmailCompany] = useState<boolean>(false);
  const [activeNewEmailCompany, setActiveNewEmailCompany] =
    useState<boolean>(false);
  const [activePhoneNumberCompany, setActivePhoneNumberCompany] =
    useState<boolean>(false);
  const [activeResetPhoneNumber, setActiveResetPhoneNumber] =
    useState<boolean>(false);

  const [updateCompanyDateAgain, setUpdateCompanyDateAgain] =
    useState<boolean>(true);

  const [isDisabledSendAgainPhone, setIsDisabledSendAgainPhone] =
    useState<boolean>(true);

  useEffect(() => {
    if (!!fetchedUserCompanys) {
      dispatch!(updateCompany(fetchedUserCompanys));
    }
  }, [fetchedUserCompanys]);

  useEffect(() => {
    const mapAllCompanys: SelectCreatedValuesProps[] = [];
    if (!!userCompanys) {
      for (const item of userCompanys) {
        if (typeof item.companyId !== "string") {
          if (!!item.companyId) {
            if (!!item.companyId!._id) {
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
      }
    }
    sortStringsItemsInArray(mapAllCompanys, "label");
    setAllCompanys(mapAllCompanys);

    let selectedCompanyId: string | null = null;

    if (!!router) {
      if (!!router.query) {
        if (!!router.query.company) {
          if (typeof router.query.company === "string") {
            selectedCompanyId = router.query.company;
          }
        }
      }
    }

    if (mapAllCompanys.length > 0) {
      let findCompany = mapAllCompanys[0];

      if (!!selectedCompanyId) {
        const findCompanyFromId = mapAllCompanys.find(
          (item) => item.value === selectedCompanyId
        );

        if (!!findCompanyFromId) {
          findCompany = findCompanyFromId;
        }
      }

      setSelectedCompany(findCompany);
    }
  }, [userCompanys, router]);

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
          if (!!!selectedUserCompany.companyId?.phoneDetails.isConfirmed) {
            setActivePhoneNumberCompany(true);
          } else {
            setActivePhoneNumberCompany(false);
          }
          setActiveEmailCompany(false);
        }

        if (!!selectedUserCompany.companyId?.companyDetails.toConfirmEmail) {
          setActiveNewEmailCompany(true);
        } else {
          setActiveNewEmailCompany(false);
        }
      }
    }
  }, [selectedUserCompany]);

  useEffect(() => {
    if (!!selectedUserCompany && !!updateCompanyDateAgain) {
      if (typeof selectedUserCompany.companyId !== "string") {
        if (!!selectedUserCompany.companyId?.phoneDetails.dateSendAgainSMS) {
          const dateCompanySentAgainSMS = new Date(
            selectedUserCompany.companyId?.phoneDetails.dateSendAgainSMS
          );
          setIsDisabledSendAgainPhone(dateCompanySentAgainSMS > new Date());
        }
      }
      setUpdateCompanyDateAgain(false);
    }
  }, [selectedUserCompany, updateCompanyDateAgain]);

  const handleChangeCompany = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps;
    setSelectedCompany(savedValue);
  };

  const handleChangeActiveEmailCompany = () => {
    setActiveEmailCompany((prevState) => !prevState);
  };

  const handleChangeActiveNewEmailCompany = () => {
    setActiveNewEmailCompany((prevState) => !prevState);
  };

  const handleShowConfirmNewPhoneCompany = () => {
    setActivePhoneNumberCompany((prevState) => !prevState);
  };

  const handleShowResetPhoneNumber = () => {
    setActiveResetPhoneNumber((prevState) => !prevState);
  };

  const handleUpdateCompanyDateAgain = (value: boolean) => {
    setUpdateCompanyDateAgain(value);
  };

  const handleEditCompany = () => {
    if (!hasPhoneToConfirm && !hasEmailAdresToConfirm) {
      router?.push(`/account/companys/edit/${companyId}`);
    }
  };

  let isAdminCompany: boolean = false;
  let hasEmailAdresToConfirm: boolean = false;
  let toConfirmEmailAdresCompany: string = "";
  let hasPhoneToConfirm: boolean = false;
  let companyId: string | null = null;
  let companyPhone: number | null = null;
  let companyRegionalCode: number | null = null;
  let hasAccessToEdit: boolean = false;
  if (!!selectedUserCompany) {
    isAdminCompany = selectedUserCompany.permissions.some((item) => {
      return item === EnumWorkerPermissions.admin;
    });

    hasAccessToEdit = selectedUserCompany.permissions.some(
      (item) => item === EnumWorkerPermissions.manageCompanyInformations
    );

    if (typeof selectedUserCompany.companyId !== "string") {
      if (!!selectedUserCompany.companyId?._id) {
        companyId = selectedUserCompany.companyId?._id;
      }

      if (!!selectedUserCompany.companyId?.companyDetails.toConfirmEmail) {
        toConfirmEmailAdresCompany =
          selectedUserCompany.companyId?.companyDetails.toConfirmEmail;
      }

      if (!!!selectedUserCompany.companyId!.companyDetails.emailIsConfirmed) {
        hasEmailAdresToConfirm = true;
      }

      if (!!!selectedUserCompany.companyId!.phoneDetails.isConfirmed) {
        hasPhoneToConfirm = true;
      }

      if (!!selectedUserCompany.companyId!.phoneDetails.number) {
        companyPhone = selectedUserCompany.companyId!.phoneDetails.number;
      }

      if (!!selectedUserCompany.companyId!.phoneDetails.regionalCode) {
        companyRegionalCode =
          selectedUserCompany.companyId!.phoneDetails.regionalCode;
      }
    }
  }

  console.log("toConfirmEmailAdresCompany", toConfirmEmailAdresCompany);

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
            <>
              <ConfirmEmailAdressCompany
                popupEnable={
                  isAdminCompany && hasEmailAdresToConfirm && activeEmailCompany
                }
                handleShowConfirmEmailCompany={handleChangeActiveEmailCompany}
                companyId={companyId}
                setActivePhoneNumberCompany={setActivePhoneNumberCompany}
                handleUpdateCompanyDateAgain={handleUpdateCompanyDateAgain}
              />
              <ConfirmNewEmailAdressCompany
                popupEnable={
                  isAdminCompany &&
                  !!toConfirmEmailAdresCompany &&
                  activeNewEmailCompany
                }
                handleShowConfirmNewEmailCompany={
                  handleChangeActiveNewEmailCompany
                }
                companyId={companyId}
                setActivePhoneNumberCompany={setActivePhoneNumberCompany}
                handleUpdateCompanyDateAgain={handleUpdateCompanyDateAgain}
              />
              <ConfirmPhoneCompany
                setActivePhoneNumberCompany={setActivePhoneNumberCompany}
                popupEnable={activePhoneNumberCompany}
                companyId={companyId}
                handleShowResetPhoneNumber={handleShowResetPhoneNumber}
                handleUpdateCompanyDateAgain={handleUpdateCompanyDateAgain}
                isDisabledSendAgainPhone={isDisabledSendAgainPhone}
              />
              {!!companyPhone && companyRegionalCode && (
                <CompanyResetPhoneNumber
                  popupEnable={activeResetPhoneNumber}
                  handleShowResetPhoneNumber={handleShowResetPhoneNumber}
                  handleShowConfirmNewPhoneCompany={
                    handleShowConfirmNewPhoneCompany
                  }
                  companyPhone={companyPhone}
                  companyRegionalCode={companyRegionalCode}
                  companyId={companyId}
                  handleUpdateCompanyDateAgain={handleUpdateCompanyDateAgain}
                  isDisabledSendAgainPhone={isDisabledSendAgainPhone}
                />
              )}
              <CompanyInformationAccording
                selectedUserCompany={selectedUserCompany}
                companyId={companyId}
                enableEdit={!hasPhoneToConfirm && !hasEmailAdresToConfirm}
                hasAccessToEdit={hasAccessToEdit}
                isAdminCompany={isAdminCompany}
                handleEditCompany={handleEditCompany}
              />
            </>
          )}
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
                  id="confirm_new_phone_company"
                  iconName="PhoneIcon"
                  widthFull
                  onClick={handleShowConfirmNewPhoneCompany}
                  color="RED"
                >
                  {texts!.confirmPhoneNumber}
                </ButtonIcon>
              </div>
            )}
            {(isAdminCompany || hasAccessToEdit) &&
              !hasPhoneToConfirm &&
              !hasEmailAdresToConfirm && (
                <div className="mb-10">
                  <ButtonIcon
                    id="edit_company"
                    iconName="PencilAltIcon"
                    widthFull
                    onClick={handleEditCompany}
                    color="SECOND"
                  >
                    {texts!.editCompany}
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

  const contentRedirect = {
    props: {},
    redirect: {
      destination: "/",
      permament: false,
    },
  };

  if (!!!session) {
    return contentRedirect;
  }
  if (!!!session.user?.email) {
    return contentRedirect;
  }

  const fetchUserCompanys = await FetchData({
    url: `${process.env.NEXTAUTH_URL}/api/companys`,
    userEmail: session.user?.email,
    method: "GET",
    ssr: true,
    async: true,
  });

  if (fetchUserCompanys?.data?.status === 401) {
    return contentRedirect;
  }

  let fetchedUserCompanys: CompanyWorkerProps[] = [];
  if (fetchUserCompanys?.success) {
    if (!!fetchUserCompanys.data.userCompanys) {
      const resultData = CompanyWorkerPropsLiveArray.safeParse(
        fetchUserCompanys.data.userCompanys
      );
      if (resultData.success) {
        fetchedUserCompanys = fetchUserCompanys.data.userCompanys;
      }
    }
  }

  return {
    props: {
      fetchedUserCompanys: fetchedUserCompanys,
    },
  };
};

export default withCompanysProps(
  withTranslates(withSiteProps(CompanyPage), "AccountCompanysPage")
);
