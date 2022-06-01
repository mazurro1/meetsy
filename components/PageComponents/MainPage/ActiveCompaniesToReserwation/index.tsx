import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, PhoneInput, Paragraph} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useEffect, useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {CompanyPropsShowNameLive} from "@/models/Company/company.model";
import ActiveCompaniesToReserwationCompanyItem from "./ActiveCompaniesToReserwationCompanyItem";

interface ActiveCompaniesToReserwationProps {
  searchCompanyName: string;
  selectedCity: string;
  selectedDistrict: string;
}

const ActiveCompaniesToReserwation: NextPage<
  ISiteProps &
    ITranslatesProps &
    IWithUserProps &
    ActiveCompaniesToReserwationProps
> = ({
  dispatch,
  siteProps,
  texts,
  searchCompanyName,
  selectedCity,
  selectedDistrict,
}) => {
  const [fetchedCompanies, setFetchedCompanies] = useState<
    CompanyPropsShowName[]
  >([]);

  useEffect(() => {
    FetchData({
      url: "/api/user/companys",
      method: "POST",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        name: searchCompanyName,
        city: selectedCity,
        district: selectedDistrict,
      },
      callback: (data) => {
        if (!data.success) {
          dispatch!(addAlertItem("Błąd podczas pobierania firm", "RED"));
        } else {
          const resultData = CompanyPropsShowNameLive.array().safeParse(
            data?.data?.companies
          );
          if (!resultData.success) {
            console.error(
              "Invalid types in: ActiveCompaniesToReserwation",
              resultData
            );
          }
          setFetchedCompanies(data?.data?.companies);
        }
      },
    });
  }, [searchCompanyName, selectedCity, selectedDistrict]);

  const mapFetchedCompaneis = fetchedCompanies.map((companyItem, index) => {
    return (
      <ActiveCompaniesToReserwationCompanyItem
        key={index}
        companyItem={companyItem}
      />
    );
  });

  return <div className="mt-20">{mapFetchedCompaneis}</div>;
};

export default withTranslates(
  withSiteProps(withUserProps(ActiveCompaniesToReserwation)),
  "ActiveCompaniesToReserwation"
);
