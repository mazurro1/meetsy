import { NextPage } from "next";
import { CityNames } from "@constants";
import { Button } from "@ui";
import styled from "styled-components";

const AllCitiesStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

interface FiltersCompanysLocalizationProps {
  handleChangeCity: (value: number) => void;
  selectedCityValue: number;
}

const FiltersCompanysLocalization: NextPage<FiltersCompanysLocalizationProps> =
  ({ handleChangeCity, selectedCityValue }) => {
    const mapedCities = CityNames.map((item) => {
      return (
        <div className="mr-5 mb-5" key={`button_city_${item.value}`}>
          <Button
            id={`button_city_${item.value}`}
            onClick={() => handleChangeCity(item.value)}
            color="GREY"
            colorHover="PRIMARY_DARK"
            colorActive="PRIMARY"
            isActive={item.value === selectedCityValue}
          >
            {item.label}
          </Button>
        </div>
      );
    });

    return (
      <>
        <AllCitiesStyle>{mapedCities}</AllCitiesStyle>
        Lokalizacja
      </>
    );
  };

export default FiltersCompanysLocalization;
