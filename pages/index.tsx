import { NextPage } from "next";
import { PageSegment, TitlePage, LinkEffect } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useSelector } from "react-redux";
import type { IStoreProps } from "@/redux/store";
import { AllIndustries, SortsNames, ListMapNames } from "@constants";
import type { AllIndustriesProps } from "@constants";
import { useState, useEffect } from "react";
import type { ValueSelectCreatedProps } from "@ui";
import FiltersCompanys from "@/components/PageComponents/MainPage/FiltersCompanys";
import { FiltersPositionStyle } from "@/components/PageComponents/MainPage/HomePage.style";
import { signIn, signOut } from "next-auth/react";

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

  const handleLogout = () => {
    signOut();
  };
  const handleLogin = async (
    email: string,
    password: string,
    name: string,
    surname: string
  ) => {
    const result = await signIn("credentials", {
      redirect: false, // jeżeli będzie true to podczas nieudanej próby logowania się zostaniemy przekierowani na stronę 404.js
      email: email,
      password: password,
      name: name,
      surname: surname,
    });
    console.log(result);
  };
  return (
    <div>
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
        <button onClick={() => signIn("google")}>google sign</button>
        <button onClick={() => signIn("facebook")}>facebook sign</button>
        <button
          onClick={() =>
            handleLogin("mazul961.hm@gmail.com", "12345ad", "Hubert", "Mazur")
          }
        >
          Login
        </button>
        <button onClick={handleLogout}>Logout</button>
        <div style={{ marginTop: "90vh" }}></div>
        <div>{searchCompanyName}</div>
        <LinkEffect path="/playground">Playground</LinkEffect>
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
