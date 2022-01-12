import { NextPage } from "next";
import { CityNames } from "@constants";
import { Button, Form, InputIcon, ButtonIcon } from "@ui";
import styled from "styled-components";
import type { FormElementsOnSubmit } from "@ui";

const AllCitiesStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

interface FiltersCompanysLocalizationProps {
  handleChangeCity: (value: number) => void;
  handleUpdateCity: (value: string, value2: string) => void;
  handleChangeInputCity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeInputDistrict: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputCity: string;
  inputDistrict: string;
  handleCancelChangeLocation: () => void;
  handleResetChangeLocation: () => void;
}

const FiltersCompanysLocalization: NextPage<FiltersCompanysLocalizationProps> =
  ({
    handleChangeCity,
    handleUpdateCity,
    handleChangeInputCity,
    inputCity,
    handleChangeInputDistrict,
    inputDistrict,
    handleCancelChangeLocation,
    handleResetChangeLocation,
  }) => {
    const handleSubmitFormLocation = (
      values: FormElementsOnSubmit[],
      isValid: boolean
    ) => {
      if (isValid) {
        let cityName: string = "";
        const findCity = values.find((item) => item.placeholder === "Miasto");
        if (!!findCity) {
          cityName = findCity.value.toString();
        }

        let districtName: string = "";
        const findDistrict = values.find(
          (item) => item.placeholder === "Dzielnica"
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
          buttonText="Szukaj"
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
                Resetuj
              </ButtonIcon>
              <ButtonIcon
                id="button_cancel_input"
                iconName="XIcon"
                onClick={handleCancelChangeLocation}
                color="GREY"
              >
                Anuluj
              </ButtonIcon>
            </>
          }
          validation={[
            {
              placeholder: "Miasto",
              isString: true,
              minLength: 3,
            },
          ]}
        >
          <InputIcon
            iconName="LocationMarkerIcon"
            placeholder="Miasto"
            color="PRIMARY"
            colorDefault="GREY_LIGHT"
            validText="Minimum 3 znaki"
            value={inputCity}
            onChange={handleChangeInputCity}
          />
          <InputIcon
            iconName="FlagIcon"
            placeholder="Dzielnica"
            color="PRIMARY"
            colorDefault="GREY_LIGHT"
            value={inputDistrict}
            onChange={handleChangeInputDistrict}
          />
        </Form>
      </>
    );
  };

export default FiltersCompanysLocalization;
