import { NextPage } from "next";
import { PageSegment, TitlePage, SelectCreated } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useSelector } from "react-redux";
import type { IStoreProps } from "@/redux/store";
import { AllIndustries, SortsNames, ListMapNames, CityNames } from "@constants";
import type { AllIndustriesProps, SortsNamesProps } from "@constants";
import { useState, useEffect } from "react";
import type { ValueSelectCreatedProps } from "@ui";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
  const [selectedSortsName, setSelectedSortsName] =
    useState<ValueSelectCreatedProps>(null);

  const selectedIndustries = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedIndustries
  );

  const searchCompanyName = useSelector(
    (state: IStoreProps) => state.searchCompanys.searchCompanyName
  );

  useEffect(() => {
    if (!!!selectedSortsName && !!SortsNames) {
      const findFirstSortsName = SortsNames[siteProps!.language].find(
        (item) => item.value === 1
      );
      if (!!findFirstSortsName) {
        setSelectedSortsName(findFirstSortsName);
      }
    }
  }, [SortsNames]);

  const handleChangeSelectSortsName = (value: ValueSelectCreatedProps) => {
    if (!!value) {
      setSelectedSortsName(value);
    }
  };

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
        <SelectCreated
          options={SortsNames[siteProps!.language]}
          value={selectedSortsName}
          handleChange={handleChangeSelectSortsName}
        />
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
