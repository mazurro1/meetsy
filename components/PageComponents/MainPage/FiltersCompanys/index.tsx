import { NextPage } from "next";
import type { SortsNamesProps } from "@constants";
import type { ValueSelectCreatedProps } from "@ui";
import { useEffect } from "react";
import { SelectCreated, ButtonPopup } from "@ui";
import { useState } from "react";
import type { FiltersCompanysProps } from "./FiltersCompanys.model";
import FiltersCompanysLocalization from "./FiltersCompanysLocalization";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { updateCity } from "@/redux/searchCompanys/actions";
import { CityNames } from "@constants";

const FiltersCompanys: NextPage<
  FiltersCompanysProps & ITranslatesProps & ISiteProps
> = ({
  selectedSortsName,
  SortsNames,
  setSelectedSortsName,
  selectedListMapName,
  setSelectedListMapName,
  ListMapNames,
  texts,
  dispatch,
  selectedCity,
  selectedDistrict,
}) => {
  const [popupLocation, setPopupLocation] = useState<boolean>(false);
  const [popupServices, setPopupServices] = useState<boolean>(false);
  const [inputCity, setInputCity] = useState<string>(selectedCity);
  const [inputDistrict, setInputDistrict] = useState<string>(selectedDistrict);

  useEffect(() => {
    if (!!!selectedSortsName && !!SortsNames) {
      const findFirstSortsName: SortsNamesProps | undefined = SortsNames.find(
        (item) => item.value === 1
      );
      if (!!findFirstSortsName) {
        setSelectedSortsName(findFirstSortsName);
      }
    }
  }, [SortsNames]);

  useEffect(() => {
    if (!!!selectedListMapName && !!ListMapNames) {
      const findFirstListMapName: SortsNamesProps | undefined =
        ListMapNames.find((item) => item.value === 1);
      if (!!findFirstListMapName) {
        setSelectedListMapName(findFirstListMapName);
      }
    }
  }, [ListMapNames]);

  const handleChangeSelectSortsName = (value: ValueSelectCreatedProps) => {
    if (!!value) {
      setSelectedSortsName(value);
    }
  };

  const handleChangeSelectListMapName = (value: ValueSelectCreatedProps) => {
    if (!!value) {
      setSelectedListMapName(value);
    }
  };

  const handleChangePopupLocation = () => {
    setPopupLocation((prevState) => !prevState);
  };

  const handleChangePopupServices = () => {
    setPopupServices((prevState) => !prevState);
  };

  const handleChangeCity = (value: number) => {
    const findCity = CityNames.find((item) => item.value === value);
    if (!!findCity) {
      setInputCity(findCity.label);
    }
  };

  const handleUpdateCity = (city: string, district: string) => {
    dispatch!(updateCity(city, district));
    setPopupLocation(false);
  };

  const handleChangeInputCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCity(e.target.value);
  };

  const handleChangeInputDistrict = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputDistrict(e.target.value);
  };

  const handleCancelChangeLocation = () => {
    setInputCity(selectedCity);
    setInputDistrict(selectedDistrict);
    setPopupLocation(false);
  };

  const handleResetChangeLocation = () => {
    setInputCity("");
    setInputDistrict("");
    setPopupLocation(false);
    dispatch!(updateCity("", ""));
  };

  return (
    <>
      <div className="mt-10 mr-10 mb-10">
        <SelectCreated
          options={SortsNames}
          value={selectedSortsName}
          handleChange={handleChangeSelectSortsName}
          deleteItem={false}
          deleteLastItem={false}
          width={250}
        />
      </div>
      <div className="mt-10 mr-10 mb-10">
        <ButtonPopup
          id="button_filter_services"
          iconName="AdjustmentsIcon"
          handleChangePopup={handleChangePopupServices}
          handleClose={handleChangePopupServices}
          popupEnable={popupServices}
          title="Filtruj po usługach"
          maxWidth={600}
        >
          Filtruj po usługach
        </ButtonPopup>
      </div>
      <div className="mt-10 mr-10 mb-10">
        <ButtonPopup
          id="button_filter_localization"
          iconName="LocationMarkerIcon"
          handleChangePopup={handleChangePopupLocation}
          handleClose={handleCancelChangeLocation}
          popupEnable={popupLocation}
          title="Lokalizacja"
          maxWidth={600}
        >
          <FiltersCompanysLocalization
            handleChangeCity={handleChangeCity}
            handleUpdateCity={handleUpdateCity}
            handleChangeInputCity={handleChangeInputCity}
            inputCity={inputCity}
            handleChangeInputDistrict={handleChangeInputDistrict}
            inputDistrict={inputDistrict}
            handleCancelChangeLocation={handleCancelChangeLocation}
            handleResetChangeLocation={handleResetChangeLocation}
          />
        </ButtonPopup>
      </div>
      <div className="mt-10 mb-10">
        <SelectCreated
          options={ListMapNames}
          value={selectedListMapName}
          handleChange={handleChangeSelectListMapName}
          deleteItem={false}
          deleteLastItem={false}
          width={200}
        />
      </div>
    </>
  );
};

export default withTranslates(withSiteProps(FiltersCompanys), "NavigationDown");
