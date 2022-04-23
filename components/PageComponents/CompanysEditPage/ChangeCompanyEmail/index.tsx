import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon, Tooltip} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {addAlertItem} from "@/redux/site/actions";
import {useState} from "react";
import {updateAllCompanysProps} from "@/redux/companys/actions";

interface ChangeCompanyEmailProps {
  companyEmail: string;
  companyEmailToConfirm: string;
  companyId: string;
}

const ChangeCompanyEmail: NextPage<
  ITranslatesProps & ISiteProps & ChangeCompanyEmailProps
> = ({
  texts,
  dispatch,
  siteProps,
  companyEmail,
  companyEmailToConfirm,
  companyId,
  router,
}) => {
  const [showChangeCompanyEmail, setshowChangeCompanyEmail] =
    useState<boolean>(false);

  const inputEmail: string = texts!.inputEmail;

  const handleShowChangeCompanyEmail = () => {
    setshowChangeCompanyEmail((prevState) => !prevState);
  };

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find((item) => item.placeholder === inputEmail);
      if (!!findEmail) {
        if (typeof findEmail.value === "string") {
          if (findEmail.value.toLowerCase() !== companyEmail.toLowerCase()) {
            FetchData({
              url: "/api/companys/edit/email",
              method: "PATCH",
              dispatch: dispatch,
              language: siteProps?.language,
              companyId: companyId,
              data: {
                newEmail: findEmail.value,
              },
              callback: (data) => {
                if (data.success) {
                  if (!!data.data.toConfirmEmail) {
                    dispatch!(
                      updateAllCompanysProps([
                        {
                          folder: "companyDetails",
                          field: "toConfirmEmail",
                          value: data.data.toConfirmEmail,
                          companyId: companyId,
                        },
                      ])
                    );
                    dispatch!(
                      updateAllCompanysProps([
                        {
                          folder: "companyDetails",
                          field: "toConfirmEmail",
                          value: data.data.toConfirmEmail,
                          companyId: companyId,
                        },
                      ])
                    );
                  }
                  handleShowChangeCompanyEmail();
                  router?.push(`/account/companys?company=${companyId}`);
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.emailIsTheSame, "RED"));
          }
        }
      }
    }
  };

  return (
    <>
      <div className="mt-10">
        <Tooltip
          text={texts!.confirmOrCancelEmail}
          enable={!!companyEmailToConfirm}
          display="inline"
        >
          <ButtonIcon
            id="company_edit_informations"
            onClick={handleShowChangeCompanyEmail}
            iconName="AtSymbolIcon"
            fullWidth
            disabled={!!companyEmailToConfirm}
          >
            {texts!.emailAdress}
          </ButtonIcon>
        </Tooltip>
      </div>
      <Popup
        popupEnable={showChangeCompanyEmail && !!!companyEmailToConfirm}
        closeUpEnable={false}
        title={texts!.emailAdress}
        maxWidth={600}
        handleClose={handleShowChangeCompanyEmail}
        id="change_email_user_account_popup"
      >
        <Form
          id="change_email_user_account"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.title}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          validation={[
            {
              placeholder: inputEmail,
              isEmail: true,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_change_email_account_button"
                onClick={handleShowChangeCompanyEmail}
                iconName="ArrowLeftIcon"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputEmail}
            defaultValue={companyEmail}
            type="text"
            id="company_new_email_input"
            iconName="AtSymbolIcon"
          />
        </Form>
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ChangeCompanyEmail)),
  "ChangeEmailUser"
);
