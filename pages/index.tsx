import {NextPage} from "next";
import {PageSegment, TitlePage, LinkEffect, UploadImage} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useSelector} from "react-redux";
import type {IStoreProps} from "@/redux/store";
import {AllIndustries, SortsNames, ListMapNames} from "@constants";
import type {AllIndustriesProps} from "@constants";
import {useState} from "react";
import type {ValueSelectCreatedProps} from "@ui";
import FiltersCompanys from "@/components/PageComponents/MainPage/FiltersCompanys";
import {FiltersPositionStyle} from "@/components/PageComponents/MainPage/HomePage.style";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
  session,
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

  const selectedDistrict = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedDistrict
  );

  const selectedService = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedService
  );

  const findIndustries: AllIndustriesProps | undefined = AllIndustries[
    siteProps!.language
  ].find((item) => item.value === selectedIndustries);

  let nameSelectedIndustries: string = "";
  if (!!findIndustries) {
    nameSelectedIndustries = findIndustries.label;
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
      <div>{searchCompanyName}</div>
      <LinkEffect path="/playground">Playground</LinkEffect>
      <UploadImage
        handleUpload={() => {}}
        id="upload_user_image"
        tooltip="Dodaj zdjęcie profilowe"
      />
    </PageSegment>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
