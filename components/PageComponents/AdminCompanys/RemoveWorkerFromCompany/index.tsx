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

interface RemoveWorkerFromCompanyProps {
  showRemoveWorkerFromCompany: boolean;
  handleShowRemoveWorkerFromCompany: () => void;
  companyId: string;
  companyBanned?: boolean;
  handleDeleteWorkerCompany: (workerId: string) => void;
  workerId: string;
}

const RemoveWorkerFromCompany: NextPage<
  ITranslatesProps & ISiteProps & RemoveWorkerFromCompanyProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showRemoveWorkerFromCompany,
  handleShowRemoveWorkerFromCompany = () => {},
  user,
  companyId,
  isMobile,
  handleDeleteWorkerCompany,
  workerId,
}) => {
  const inputPassword: string = texts!.inputPassword;

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findPassword) {
        FetchData({
          url: "/api/admin/companys/workers",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyId,
          data: {
            workerId: workerId,
            adminPassword: findPassword.value,
          },
          callback: (data) => {
            if (data.success) {
              handleDeleteWorkerCompany(workerId);
            }
          },
        });
      }
    }
  };

  return (
    <Popup
      popupEnable={
        showRemoveWorkerFromCompany && !!!user?.userDetails.toConfirmEmail
      }
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowRemoveWorkerFromCompany}
      id="remove_worker_company_admin_popup"
      color="RED"
    >
      <Form
        id="remove_worker_company_admin"
        onSubmit={handleOnChangeEmail}
        buttonText={texts!.button}
        buttonColor="RED"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="BanIcon"
        buttonsFullWidth={isMobile}
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
              id="show_remove_worker_company_admin_button"
              onClick={handleShowRemoveWorkerFromCompany}
              iconName="ArrowLeftIcon"
              fullWidth={isMobile}
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
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
    withSiteProps(withCompanysProps(RemoveWorkerFromCompany)),
    "RemoveWorkerFromCompany"
  )
);
