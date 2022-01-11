import { NextPage } from "next";
import type { SortsNamesProps } from "@constants";
import type { ValueSelectCreatedProps } from "@ui";
import { useEffect } from "react";
import { SelectCreated, ButtonPopup } from "@ui";
import { useState } from "react";
import { CityNames } from "@constants";
import type { FiltersCompanysProps } from "./FiltersCompanys.model";

const FiltersCompanys: NextPage<FiltersCompanysProps> = ({
  selectedSortsName,
  SortsNames,
  setSelectedSortsName,
  selectedListMapName,
  setSelectedListMapName,
  ListMapNames,
}) => {
  const [popupLocation, setPopupLocation] = useState<boolean>(false);
  const [popupServices, setPopupServices] = useState<boolean>(false);

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
          popupEnable={popupServices}
          title="Filtruj po usługach"
        >
          Filtruj po usługach
        </ButtonPopup>
      </div>
      <div className="mt-10 mr-10 mb-10">
        <ButtonPopup
          id="button_filter_localization"
          iconName="HomeIcon"
          handleChangePopup={handleChangePopupLocation}
          popupEnable={popupLocation}
          title="Lokalizacja"
        >
          {CityNames.map((item) => item.label + " ")}
          Lokalizacja
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

export default FiltersCompanys;
