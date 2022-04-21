import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {updateAllCompanysProps} from "@/redux/companys/actions";
import {addAlertItem} from "@/redux/site/actions";
import {useEffect, useState} from "react";

interface ChangeCompanyInformationProps {
  companyName: string;
  companyNip: number;
  companyId: string;
}

const ChangeCompanyInformation: NextPage<
  ITranslatesProps & ISiteProps & ChangeCompanyInformationProps
> = ({texts, dispatch, siteProps, companyName, companyNip, companyId}) => {
  const [showChangeCompanyInformation, setshowChangeCompanyInformation] =
    useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [inputNipValue, setInputNipValue] = useState<number | null>(null);

  useEffect(() => {
    if (!!companyName) {
      setInputNameValue(companyName.toUpperCase());
    }
    if (!!companyNip) {
      setInputNipValue(companyNip);
    }
  }, [companyName, companyNip]);

  const inputName: string = texts!.inputName;
  const inputNip: string = texts!.inputNip;

  const handleShowChangeCompanyInformation = () => {
    setshowChangeCompanyInformation((prevState) => !prevState);
  };

  const handleChangeName = (value: string) => {
    setInputNameValue(value);
  };

  const handleChangeNip = (value: string) => {
    setInputNipValue(!!value ? Number(value) : null);
  };

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findName = values.find((item) => item.placeholder === inputName);
      const findNip = values.find((item) => item.placeholder === inputNip);
      if (!!findName && !!findNip) {
        if (typeof findName.value === "string") {
          if (
            findName.value.toUpperCase() !== companyName.toUpperCase() ||
            findNip.value !== companyNip
          ) {
            let isValidNip = true;
            if (!!findNip.value) {
              if (findNip.value.toString().length === 10) {
                isValidNip = true;
              } else {
                isValidNip = false;
              }
            }
            if (isValidNip) {
              FetchData({
                url: "/api/companys/edit/information",
                method: "PATCH",
                dispatch: dispatch,
                language: siteProps?.language,
                companyId: companyId,
                data: {
                  newName: findName.value,
                  newNip: !!findNip.value ? findNip.value : null,
                },
                callback: (data) => {
                  if (data.success) {
                    if (!!data.data.name) {
                      dispatch!(
                        updateAllCompanysProps([
                          {
                            folder: "companyDetails",
                            field: "name",
                            value: data.data.name,
                            companyId: companyId,
                          },
                        ])
                      );
                    }
                    if (!!data.data.nip) {
                      dispatch!(
                        updateAllCompanysProps([
                          {
                            folder: "companyDetails",
                            field: "nip",
                            value: data.data.nip,
                            companyId: companyId,
                          },
                        ])
                      );
                    }
                    handleShowChangeCompanyInformation();
                  }
                },
              });
            } else {
              dispatch!(addAlertItem(texts!.nipInvalid, "RED"));
            }
          } else {
            dispatch!(addAlertItem(texts!.noNewData, "RED"));
          }
        } else {
          dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
        }
      } else {
        dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
      }
    }
  };

  return (
    <>
      <div className="">
        <ButtonIcon
          id="company_edit_informations"
          onClick={handleShowChangeCompanyInformation}
          iconName="IdentificationIcon"
          widthFull
        >
          {texts!.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={showChangeCompanyInformation}
        closeUpEnable={false}
        title={texts!.title}
        maxWidth={600}
        handleClose={handleShowChangeCompanyInformation}
        id="change_email_user_account_popup"
      >
        <Form
          id="change_email_user_account"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.button}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          validation={[
            {
              placeholder: inputName,
              isString: true,
              minLength: 5,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_change_company_informations_button"
                onClick={handleShowChangeCompanyInformation}
                iconName="ArrowLeftIcon"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputName}
            type="text"
            id="company_new_name_input"
            iconName="IdentificationIcon"
            validText="Minimum 5 znaków"
            value={inputNameValue}
            onChange={handleChangeName}
            uppercase
          />
          <InputIcon
            placeholder={inputNip}
            type="number"
            id="company_new_nip_input"
            iconName="LibraryIcon"
            validText="Opcjonalne"
            value={inputNipValue?.toString()}
            onChange={handleChangeNip}
          />
        </Form>
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ChangeCompanyInformation)),
  "ChangeCompanyInformation"
);
