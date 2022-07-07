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
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import {CompanyWorkerPropsLive} from "@/models/CompanyWorker/companyWorker.model";

interface AddWorkerToCompanyProps {
  showAddWorkerToCompany: boolean;
  handleShowAddWorkerToCompany?: () => void;
  companyData: CompanyProps;
  handleAddCompany: (newWorker: CompanyWorkerProps) => void;
}

const AddWorkerToCompany: NextPage<
  ITranslatesProps & ISiteProps & AddWorkerToCompanyProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showAddWorkerToCompany,
  handleShowAddWorkerToCompany = () => {},
  user,
  companyData,
  handleAddCompany,
  isMobile,
}) => {
  const inputEmail: string = texts!.inputEmail;
  const inputPassword: string = texts!.inputPassword;

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findEmail = values.find((item) => item.placeholder === inputEmail);
      if (!!findPassword && !!findEmail) {
        FetchData({
          url: "/api/admin/companys/workers",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyData?._id,
          data: {
            adminPassword: findPassword.value,
            workerEmail: findEmail.value,
          },
          callback: (data) => {
            if (data.success) {
              const resultData = CompanyWorkerPropsLive.safeParse(
                data.data.newWorker
              );
              if (resultData.success) {
                handleAddCompany(resultData.data);
              } else {
                console.error(resultData.error);
              }
              handleShowAddWorkerToCompany();
            }
          },
        });
      }
    }
  };

  return (
    <Popup
      popupEnable={
        showAddWorkerToCompany && !!!user?.userDetails.toConfirmEmail
      }
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowAddWorkerToCompany}
      id="ban_company_admin_popup"
    >
      <Form
        id="ban_company_admin"
        onSubmit={handleOnChangeEmail}
        buttonText={texts!.button}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="UserAddIcon"
        buttonsFullWidth={isMobile}
        validation={[
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputEmail,
            isEmail: true,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_ban_company_admin_button"
              onClick={handleShowAddWorkerToCompany}
              iconName="ArrowLeftIcon"
              fullWidth={isMobile}
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputEmail}
          validTextGenerate="REQUIRED"
          type="email"
          id="worker_email_input"
          iconName="AtSymbolIcon"
        />
        <InputIcon
          placeholder={inputPassword}
          validTextGenerate="MIN_6"
          type="password"
          id="admin_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(AddWorkerToCompany)),
    "AddWorkerToCompany"
  )
);
