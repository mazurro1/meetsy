import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  withSiteProps,
  withTranslates,
  withCompanysProps,
  withUserProps,
} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {CompanyProps} from "@/models/Company/company.model";
import type {UpdateCompanyProps} from "@/pages/admin/companys/index";

interface BanCompanyProps {
  showBanCompany: boolean;
  handleShowBanCompany?: () => void;
  companyData: CompanyProps;
  companyBanned?: boolean;
  handleUpdateCompany: (values: UpdateCompanyProps[]) => void;
}

const BanCompany: NextPage<
  ITranslatesProps & ISiteProps & BanCompanyProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showBanCompany,
  handleShowBanCompany = () => {},
  user,
  companyData,
  companyBanned,
  handleUpdateCompany,
}) => {
  const inputPassword: string = texts!.inputPassword;

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid && typeof companyBanned === "boolean") {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findPassword) {
        FetchData({
          url: "/api/admin/companys",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyData?._id,
          data: {
            adminPassword: findPassword.value,
            bannedCompany: !companyBanned,
          },
          callback: (data) => {
            if (data.success) {
              if (data.data.banned !== "undefined") {
                handleUpdateCompany([
                  {
                    field: "banned",
                    value: data.data.banned,
                  },
                ]);
              }
              handleShowBanCompany();
            }
          },
        });
      }
    }
  };

  return (
    <Popup
      popupEnable={showBanCompany && !!!user?.userDetails.toConfirmEmail}
      closeUpEnable={false}
      title={companyBanned ? texts!.unbanTitle : texts!.title}
      maxWidth={600}
      handleClose={handleShowBanCompany}
      id="ban_company_admin_popup"
    >
      <Form
        id="ban_company_admin"
        onSubmit={handleOnChangeEmail}
        buttonText={companyBanned ? texts!.unbanTitle : texts!.title}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_ban_company_admin_button"
              onClick={handleShowBanCompany}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputPassword}
          validTextGenerate="MIN_6"
          validText={texts!.minLetter}
          type="password"
          id="admin_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withUserProps(
  withTranslates(withSiteProps(withCompanysProps(BanCompany)), "BanCompany")
);
