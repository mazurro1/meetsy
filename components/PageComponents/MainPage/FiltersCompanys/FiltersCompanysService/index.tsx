import { NextPage } from "next";
import { Form, InputIcon, ButtonIcon } from "@ui";
import type { FormElementsOnSubmit } from "@ui";
import { withTranslates } from "@hooks";
import type { ITranslatesProps } from "@hooks";
import type { FiltersCompanysServiceProps } from "./FiltersCompanysService.model";

const FiltersCompanysService: NextPage<
  FiltersCompanysServiceProps & ITranslatesProps
> = ({
  inputService,
  handleChangeInputService,
  handleUpdateService,
  handleResetChangeService,
  handleCancelChangeService,
  texts,
}) => {
  const handleSubmitFormService = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      let cityName: string = "";
      const findService: FormElementsOnSubmit | undefined = values.find(
        (item) => item.placeholder === texts!.service
      );
      if (!!findService) {
        cityName = findService.value.toString();
      }

      handleUpdateService(cityName);
    }
  };

  return (
    <>
      <Form
        validation={[
          {
            placeholder: texts!.service,
            isString: true,
            minLength: 3,
            maxLength: 30,
          },
        ]}
        id="form_select_service"
        buttonText={texts!.search}
        onSubmit={handleSubmitFormService}
        marginBottom={0}
        marginTop={0}
        buttonColor="GREEN"
        iconName="SearchIcon"
        extraButtons={
          <>
            <ButtonIcon
              id="button_reset_input"
              onClick={handleResetChangeService}
              color="RED"
              iconName="RefreshIcon"
            >
              {texts!.reset}
            </ButtonIcon>
            <ButtonIcon
              id="button_cancel_input"
              iconName="XIcon"
              onClick={handleCancelChangeService}
              color="GREY"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          value={inputService}
          placeholder={texts!.service}
          onChange={handleChangeInputService}
          color="PRIMARY"
          colorDefault="GREY_LIGHT"
          validText={texts!.validMinLetter}
          iconName="ClipboardCheckIcon"
        />
      </Form>
    </>
  );
};

export default withTranslates(FiltersCompanysService, "FiltersCompanysService");
