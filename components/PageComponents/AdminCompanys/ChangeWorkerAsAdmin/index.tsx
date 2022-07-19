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
import {CompanyWorkerPropsLive} from "@/models/CompanyWorker/companyWorker.model";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

interface ChangeWorkerAsAdminProps {
  showChangeWorkerAsAdmin: boolean;
  handleShowChangeWorkerAsAdmin?: () => void;
  companyId: string;
  handleUpdateAllWorkers: (allWorkers: CompanyWorkerProps[]) => void;
  workerId: string;
  workerEmail: string | null;
}

const ChangeWorkerAsAdmin: NextPage<
  ITranslatesProps & ISiteProps & ChangeWorkerAsAdminProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showChangeWorkerAsAdmin,
  handleShowChangeWorkerAsAdmin = () => {},
  user,
  companyId,
  isMobile,
  handleUpdateAllWorkers,
  workerId,
  workerEmail,
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
      if (!!findPassword && !!workerEmail) {
        FetchData({
          url: "/api/admin/companys/workers/permissions",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyId,
          data: {
            adminPassword: findPassword.value,
            workerEmail: workerEmail,
          },
          callback: (data) => {
            if (data.success) {
              const resultData = CompanyWorkerPropsLive.array().safeParse(
                data.data.workers
              );
              if (resultData.success) {
                if (!!resultData.data) {
                  handleUpdateAllWorkers(resultData.data);
                }
              } else {
                console.error(resultData.error);
              }
              handleShowChangeWorkerAsAdmin();
            }
          },
        });
      }
    }
  };

  return (
    <>
      <div className="mt-5">
        <ButtonIcon
          id="button_change_admin_company"
          iconName="UserGroupIcon"
          onClick={handleShowChangeWorkerAsAdmin}
          fullWidth
          color="SECOND"
        >
          {texts?.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={
          showChangeWorkerAsAdmin && !!!user?.userDetails.toConfirmEmail
        }
        closeUpEnable={false}
        title={texts!.title}
        maxWidth={600}
        handleClose={handleShowChangeWorkerAsAdmin}
        id="change_admin_company_popup"
      >
        <Form
          id="change_admin_company"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.button}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
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
                id="show_change_admin_company_button"
                onClick={handleShowChangeWorkerAsAdmin}
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
    </>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(ChangeWorkerAsAdmin)),
    "ChangeWorkerAsAdmin"
  )
);
