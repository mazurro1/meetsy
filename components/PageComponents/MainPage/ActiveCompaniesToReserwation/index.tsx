import {NextPage} from "next";
import {ButtonIcon, FetchData, Tooltip} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useEffect, useState, useRef} from "react";
import {addAlertItem} from "@/redux/site/actions";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {CompanyPropsShowNameLive} from "@/models/Company/company.model";
import ActiveCompaniesToReserwationCompanyItem from "./ActiveCompaniesToReserwationCompanyItem";
import type {ValueSelectCreatedProps} from "@ui";
import sal from "sal.js";

interface ActiveCompaniesToReserwationProps {
  searchCompanyName: string;
  selectedCity: string;
  selectedDistrict: string;
  selectedSortsName: ValueSelectCreatedProps;
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
  selectedSortsName,
}) => {
  const [fetchedCompanies, setFetchedCompanies] = useState<
    CompanyPropsShowName[]
  >([]);
  const [pageCompanys, setPageCompanys] = useState<number>(1);
  const [disableShowMoreCompanys, setDisableShowMoreCompanys] =
    useState<boolean>(false);
  const refAllCompanies = useRef<HTMLDivElement>(null);

  let validSortValue = 1;

  if (!!selectedSortsName) {
    const selectedSortIsArray = Array.isArray(selectedSortsName);
    if (!!!selectedSortIsArray) {
      validSortValue = Number(selectedSortsName.value);
    }
  }

  useEffect(() => {
    setPageCompanys(1);
  }, [validSortValue, searchCompanyName, selectedCity, selectedDistrict]);

  useEffect(() => {
    sal({
      threshold: 0.01,
      once: true,
      root: refAllCompanies.current,
    });
  }, [
    refAllCompanies,
    pageCompanys,
    validSortValue,
    searchCompanyName,
    selectedCity,
    selectedDistrict,
    fetchedCompanies,
  ]);

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
        sort: validSortValue,
        page: pageCompanys,
      },
      callback: (data) => {
        if (!data.success) {
          dispatch!(addAlertItem(texts!.errorFetchCompanies, "RED"));
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
          const isArrayCompanies = Array.isArray(data?.data?.companies);
          if (isArrayCompanies) {
            if (data.data.companies.length === 0) {
              setDisableShowMoreCompanys(true);
            } else {
              setDisableShowMoreCompanys(false);
              setFetchedCompanies((prevState) => {
                if (pageCompanys === 1) {
                  return [...data.data.companies];
                } else {
                  return [...prevState, ...data.data.companies];
                }
              });
            }
          }
        }
      },
    });
  }, [
    searchCompanyName,
    selectedCity,
    selectedDistrict,
    validSortValue,
    pageCompanys,
  ]);

  const handleShowMoreCompanies = () => {
    setPageCompanys((prevState) => {
      return prevState + 1;
    });
  };

  const mapFetchedCompaneis = fetchedCompanies.map((companyItem, index) => {
    return (
      <ActiveCompaniesToReserwationCompanyItem
        key={index}
        companyItem={companyItem}
      />
    );
  });

  return (
    <div className="mt-20" ref={refAllCompanies}>
      {mapFetchedCompaneis}
      <div className="mt-40">
        <Tooltip
          text={texts!.noMoreCompanies}
          enable={disableShowMoreCompanys}
          fullWidth
        >
          <ButtonIcon
            isFetchToBlock
            id="button_show_more_companys"
            onClick={handleShowMoreCompanies}
            iconName="ArrowDownIcon"
            disabled={disableShowMoreCompanys}
            fullWidth
            fontSize="LARGE"
          >
            {texts!.showMoreCompanies}
          </ButtonIcon>
        </Tooltip>
      </div>
    </div>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ActiveCompaniesToReserwation)),
  "ActiveCompaniesToReserwation"
);
