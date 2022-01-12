import { NextPage } from "next";
import { PageSegment, TitlePage } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useSelector } from "react-redux";
import type { IStoreProps } from "@/redux/store";
import { AllIndustries, SortsNames, ListMapNames } from "@constants";
import type { AllIndustriesProps } from "@constants";
import { useState } from "react";
import type { ValueSelectCreatedProps } from "@ui";
import FiltersCompanys from "@/components/PageComponents/MainPage/FiltersCompanys";
import { FiltersPositionStyle } from "@/components/PageComponents/MainPage/HomePage.style";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
  const [selectedSortsName, setSelectedSortsName] =
    useState<ValueSelectCreatedProps>(null);
  const [selectedListMapName, setSelectedListMapName] =
    useState<ValueSelectCreatedProps>(null);

  const selectedIndustries = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedIndustries
  );

  const searchCompanyName = useSelector(
    (state: IStoreProps) => state.searchCompanys.searchCompanyName
  );

  const selectedCity = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedCity
  );

  const findIndustries: AllIndustriesProps | undefined = AllIndustries[
    siteProps!.language
  ].find((item) => item.value === selectedIndustries);

  let nameSelectedIndustries: string = "";
  if (!!findIndustries) {
    nameSelectedIndustries = findIndustries.label;
  }

  return (
    <div>
      <PageSegment id="home_page">
        <TitlePage>{nameSelectedIndustries}</TitlePage>
        <div>{searchCompanyName}</div>
        <FiltersPositionStyle>
          <FiltersCompanys
            selectedSortsName={selectedSortsName}
            SortsNames={SortsNames[siteProps!.language]}
            setSelectedSortsName={setSelectedSortsName}
            selectedListMapName={selectedListMapName}
            setSelectedListMapName={setSelectedListMapName}
            ListMapNames={ListMapNames[siteProps!.language]}
            selectedCity={selectedCity}
          />
        </FiltersPositionStyle>
        <div style={{ marginTop: "90vh" }}></div>
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
