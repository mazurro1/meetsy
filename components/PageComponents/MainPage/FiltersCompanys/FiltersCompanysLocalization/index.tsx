import { NextPage } from "next";
import { CityNames } from "@constants";
import { Button, Form, InputIcon, ButtonIcon } from "@ui";
import type { FormElementsOnSubmit } from "@ui";
import { withTranslates } from "@hooks";
import type { ITranslatesProps } from "@hooks";
import { AllCitiesStyle } from "./FiltersCompanysLocalization.style";
import type { FiltersCompanysLocalizationProps } from "./FiltersCompanysLocalization.model";

const FiltersCompanysLocalization: NextPage<
  FiltersCompanysLocalizationProps & ITranslatesProps
> = ({
  handleChangeCity,
  handleUpdateCity,
  handleChangeInputCity,
  inputCity,
  handleChangeInputDistrict,
  inputDistrict,
  handleCancelChangeLocation,
  handleResetChangeLocation,
  texts,
}) => {
  const handleSubmitFormLocation = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      let cityName: string = "";
      const findCity: FormElementsOnSubmit | undefined = values.find(
        (item) => item.placeholder === texts!.city
      );
      if (!!findCity) {
        cityName = findCity.value.toString();
      }

      let districtName: string = "";
      const findDistrict: FormElementsOnSubmit | undefined = values.find(
        (item) => item.placeholder === texts!.district
      );
      if (!!findDistrict) {
        districtName = findDistrict.value.toString();
      }
      handleUpdateCity(cityName, districtName);
    }
  };

  const mapedCities = CityNames.map((item) => {
    return (
      <div className="mr-5 mb-5" key={`button_city_${item.value}`}>
        <Button
          id={`button_city_${item.value}`}
          onClick={() => handleChangeCity(item.value)}
          color="GREY"
          colorHover="PRIMARY_DARK"
          colorActive="PRIMARY"
          isActive={item.label.toLowerCase() === inputCity.toLowerCase()}
        >
          {item.label}
        </Button>
      </div>
    );
  });

  return (
    <>
      <AllCitiesStyle>{mapedCities}</AllCitiesStyle>
      <Form
        id="form_select_location"
        buttonText={texts!.search}
        onSubmit={handleSubmitFormLocation}
        marginBottom={0}
        buttonColor="GREEN"
        iconName="SearchIcon"
        extraButtons={
          <>
            <ButtonIcon
              id="button_reset_input"
              onClick={handleResetChangeLocation}
              color="RED"
              iconName="RefreshIcon"
            >
              {texts!.reset}
            </ButtonIcon>
            <ButtonIcon
              id="button_cancel_input"
              iconName="XIcon"
              onClick={handleCancelChangeLocation}
              color="GREY"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
        validation={[
          {
            placeholder: texts!.city,
            isString: true,
            minLength: 3,
            maxLength: 30,
          },
          {
            placeholder: texts!.district,
            isString: true,
            maxLength: 30,
          },
        ]}
      >
        <InputIcon
          iconName="LocationMarkerIcon"
          placeholder={texts!.city}
          color="PRIMARY"
          colorDefault="GREY_LIGHT"
          validText={texts!.validMinLetter}
          value={inputCity}
          onChange={handleChangeInputCity}
        />
        <InputIcon
          iconName="FlagIcon"
          placeholder={texts!.district}
          color="PRIMARY"
          colorDefault="GREY_LIGHT"
          value={inputDistrict}
          onChange={handleChangeInputDistrict}
        />
      </Form>
    </>
  );
};

export default withTranslates(
  FiltersCompanysLocalization,
  "FiltersCompanysLocalization"
);
