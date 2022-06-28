import {NextPage} from "next";
import {PageSegment, TitlePage, HiddenContent} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useSelector} from "react-redux";
import type {IStoreProps} from "@/redux/store";
import {AllIndustries, SortsNames, ListMapNames} from "@constants";
import type {AllIndustriesProps} from "@constants";
import {useEffect, useState} from "react";
import type {ValueSelectCreatedProps} from "@ui";
import FiltersCompanys from "@/components/PageComponents/MainPage/FiltersCompanys";
import {FiltersPositionStyle} from "@/components/PageComponents/MainPage/HomePage.style";
import ActiveCompaniesToReserwation from "@/components/PageComponents/MainPage/ActiveCompaniesToReserwation";
import dynamic from "next/dynamic";
import getStripe from "@/utils/get-stripe";

const ActiveCompaniesMap = dynamic(
  () => import("@/components/PageComponents/MainPage/ActiveCompaniesMap"),
  {
    ssr: false,
  }
);

const Home: NextPage<ISiteProps & ITranslatesProps & IWithUserProps> = ({
  siteProps,
  texts,
  session,
  dispatch,
  user,
}) => {
  const [selectedSortsName, setSelectedSortsName] =
    useState<ValueSelectCreatedProps>(null);
  const [selectedListMapName, setSelectedListMapName] =
    useState<ValueSelectCreatedProps>(null);
  const [selectedListOfferTimeout, setSelectedListOfferTimeout] =
    useState<number>(1);

  const selectedIndustries = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedIndustries
  );

  const searchCompanyName = useSelector(
    (state: IStoreProps) => state.searchCompanys.searchCompanyName
  );

  const selectedCity = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedCity
  );

  const selectedDistrict = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedDistrict
  );

  const selectedService = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedService
  );

  useEffect(() => {
    let valueListOfferToSet: number = 1;
    if (!!selectedListMapName) {
      if (!!!Array.isArray(selectedListMapName)) {
        valueListOfferToSet = Number(selectedListMapName.value);
      }
    }
    const timer = setTimeout(() => {
      setSelectedListOfferTimeout(valueListOfferToSet);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [selectedListMapName]);

  const findIndustries: AllIndustriesProps | undefined = AllIndustries[
    siteProps!.language
  ].find((item) => item.value === selectedIndustries);

  let nameSelectedIndustries: string = "";
  if (!!findIndustries) {
    nameSelectedIndustries = findIndustries.label;
  }

  let valueListOffer: number = 1;
  if (!!selectedListMapName) {
    if (!!!Array.isArray(selectedListMapName)) {
      valueListOffer = Number(selectedListMapName.value);
    }
  }

  return (
    <PageSegment id="home_page">
      <TitlePage>{nameSelectedIndustries}</TitlePage>
      <FiltersPositionStyle>
        <FiltersCompanys
          selectedSortsName={selectedSortsName}
          SortsNames={SortsNames[siteProps!.language]}
          setSelectedSortsName={setSelectedSortsName}
          selectedListMapName={selectedListMapName}
          setSelectedListMapName={setSelectedListMapName}
          ListMapNames={ListMapNames[siteProps!.language]}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedService={selectedService}
        />
      </FiltersPositionStyle>
      <HiddenContent
        enable={selectedListOfferTimeout === 1 && valueListOffer === 1}
      >
        <ActiveCompaniesToReserwation
          searchCompanyName={searchCompanyName}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedSortsName={selectedSortsName}
        />
      </HiddenContent>
      <HiddenContent
        enable={selectedListOfferTimeout === 2 && valueListOffer === 2}
      >
        <ActiveCompaniesMap
          searchCompanyName={searchCompanyName}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedSortsName={selectedSortsName}
        />
      </HiddenContent>
    </PageSegment>
  );
};

export default withUserProps(withTranslates(withSiteProps(Home), "HomePage"));
