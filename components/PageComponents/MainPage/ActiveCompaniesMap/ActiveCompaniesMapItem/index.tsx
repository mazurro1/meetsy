import {NextPage} from "next";
import {withTranslates} from "@hooks";
import styled from "styled-components";
import type {CompanyLocationProps} from "@/models/Company/company.model";
import {Marker, Popup as PopupMap} from "react-leaflet";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {ButtonIcon, Paragraph, Heading} from "@ui";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";

const CustomMarker = styled.div`
  .leaflet-marker-icon .leaflet-zoom-animated .leaflet-interactive {
    background-color: red;
  }
`;

interface ActiveCompaniesMapItemProps {
  location?: CompanyLocationProps | null;
  companyItem: CompanyPropsShowName;
}

const ActiveCompaniesMapItem: NextPage<
  ActiveCompaniesMapItemProps & ISiteProps
> = ({location, companyItem, router}) => {
  let validPostalCode: string = "00-000";

  if (!!companyItem?.companyContact?.postalCode) {
    const stringPostalCode = companyItem?.companyContact?.postalCode.toString();
    if (!!stringPostalCode) {
      if (stringPostalCode.length >= 3) {
        validPostalCode = `${stringPostalCode.slice(
          0,
          2
        )}-${stringPostalCode.slice(2, stringPostalCode.length)}`;
      }
    }
  }

  return (
    <CustomMarker>
      <Marker position={[Number(location?.lat), Number(location?.lng)]}>
        <PopupMap>
          <Heading
            tag={2}
            uppercase
            marginTop={0}
            marginBottom={0}
            color="PRIMARY_DARK"
          >
            {companyItem?.companyDetails?.name}
          </Heading>
          <Paragraph
            marginTop={0}
            spanBold
            dangerouslySetInnerHTML={`${validPostalCode} <span>${companyItem?.companyContact?.city.placeholder}</span>,`}
            marginBottom={0}
          ></Paragraph>
          <Paragraph marginTop={0} marginBottom={0}>
            {`${companyItem?.companyContact?.district.placeholder},`}
          </Paragraph>
          <Paragraph
            marginTop={0}
            marginBottom={0}
            dangerouslySetInnerHTML={`${companyItem?.companyContact?.street.placeholder}`}
            bold
          />
          <div className="mt-20">
            <ButtonIcon
              id="button_go_to_company_from_maps"
              onClick={() => {}}
              loadingToChangeRouteLink={`${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${companyItem?.companyContact.url}`}
              iconName="ArrowRightIcon"
              fontSize="SMALL"
              fullWidth
            >
              Przejdz do firmy
            </ButtonIcon>
          </div>
        </PopupMap>
      </Marker>
    </CustomMarker>
  );
};

export default withTranslates(
  withSiteProps(ActiveCompaniesMapItem),
  "ActiveCompaniesToReserwation"
);
