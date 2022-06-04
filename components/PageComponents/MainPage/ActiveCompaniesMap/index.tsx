import {NextPage} from "next";
import {FetchData} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useEffect, useState, useCallback} from "react";
import {addAlertItem} from "@/redux/site/actions";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {CompanyPropsShowNameLive} from "@/models/Company/company.model";
import type {ValueSelectCreatedProps} from "@ui";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L, {LatLngTuple} from "leaflet";
import ActiveCompaniesMapItem from "./ActiveCompaniesMapItem";
import type {CompanyLocationProps} from "@/models/Company/company.model";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styled from "styled-components";
import {Colors} from "@constants";

const MapStyle = styled.div<{
  colorBackground: string;
  colorClose: string;
}>`
  position: relative;
  z-index: 1;

  .leaflet-popup-content-wrapper {
    background-color: ${(props) => props.colorBackground};
  }

  .leaflet-popup-tip {
    background-color: ${(props) => props.colorBackground};
  }

  .leaflet-popup-close-button {
    color: ${(props) => `${props.colorClose} !important`};
  }
  p {
    margin: 0 !important;
  }
`;

interface ActiveCompaniesMapProps {
  searchCompanyName: string;
  selectedCity: string;
  selectedDistrict: string;
  selectedSortsName: ValueSelectCreatedProps;
}

const ActiveCompaniesMap: NextPage<
  ISiteProps & ITranslatesProps & IWithUserProps & ActiveCompaniesMapProps
> = ({
  dispatch,
  siteProps,
  texts,
  searchCompanyName,
  selectedCity,
  selectedDistrict,
  selectedSortsName,
  isMobile,
}) => {
  const [fetchedCompanies, setFetchedCompanies] = useState<
    CompanyPropsShowName[]
  >([]);
  const [locationCity, setLocationCity] = useState<null | CompanyLocationProps>(
    null
  );
  const [zoomMap, setZoomMap] = useState(5);

  let validSortValue = 1;

  if (!!selectedSortsName) {
    const selectedSortIsArray = Array.isArray(selectedSortsName);
    if (!!!selectedSortIsArray) {
      validSortValue = Number(selectedSortsName.value);
    }
  }

  const fetchDataForCompanies = useCallback(
    (userLatLng: null | CompanyLocationProps = null) => {
      FetchData({
        url: "/api/user/companys",
        method: "PATCH",
        dispatch: dispatch,
        language: siteProps?.language,
        data: {
          name: searchCompanyName,
          city: selectedCity,
          district: selectedDistrict,
        },
        callback: (data) => {
          if (!data.success) {
            dispatch!(addAlertItem(texts!.errorFetchCompanies, "RED"));
          } else {
            if (!!!selectedCity) {
              dispatch!(
                addAlertItem(texts!.selectFiltersToShowAllCompanies, "RED")
              );
            }
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
              setFetchedCompanies(data?.data?.companies);
            }
            if (!!data?.data?.location) {
              setLocationCity(
                !!selectedCity
                  ? data.data.location
                  : !!userLatLng
                  ? userLatLng
                  : null
              );
              setZoomMap(!!selectedCity ? 13 : !!userLatLng ? 13 : 5);
            } else {
              if (!!userLatLng) {
                setZoomMap(13);
                setLocationCity(userLatLng);
              } else {
                setZoomMap(5);
              }
            }
          }
        },
      });
    },
    [searchCompanyName, selectedCity, selectedDistrict, validSortValue]
  );

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (resultGeolocation) => {
        const userLatLng: CompanyLocationProps | null = {
          lat: resultGeolocation.coords.latitude,
          lng: resultGeolocation.coords.longitude,
        };
        fetchDataForCompanies(userLatLng);
      },
      () => {
        fetchDataForCompanies(null);
      }
    );
  }, [searchCompanyName, selectedCity, selectedDistrict, validSortValue]);

  const filterLocations = fetchedCompanies.filter(
    (item) => !!item?.companyContact.location
  );
  const mapListLocations = filterLocations.map((item, index) => {
    return (
      <ActiveCompaniesMapItem
        location={item?.companyContact?.location}
        companyItem={item}
        key={index}
      />
    );
  });

  const centerProps: LatLngTuple = !!locationCity
    ? [
        !!locationCity?.lat ? locationCity?.lat : 51.919438,
        !!locationCity?.lng ? locationCity?.lng : 51.919438,
      ]
    : [51.919438, 19.145136];

  let colorBackground: string = Colors(siteProps).backgroundColorPage;
  let colorClose: string = Colors(siteProps).textBlack;

  return (
    <>
      <MapStyle
        id="map"
        colorBackground={colorBackground}
        colorClose={colorClose}
      >
        <MapContainer
          center={centerProps}
          zoom={zoomMap}
          style={{height: isMobile ? "300px" : "600px", width: "100%"}}
          key={`${zoomMap}-${locationCity?.lat}-${locationCity?.lng}`}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapListLocations}
        </MapContainer>
      </MapStyle>
    </>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ActiveCompaniesMap)),
  "ActiveCompaniesToReserwation"
);
