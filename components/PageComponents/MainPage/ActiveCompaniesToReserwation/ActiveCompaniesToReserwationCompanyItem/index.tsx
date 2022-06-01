import {NextPage} from "next";
import {
  ButtonIcon,
  FetchData,
  Popup,
  Form,
  PhoneInput,
  Paragraph,
  GenerateIcons,
  ImageNext,
  Heading,
} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {
  ItemCompanyStyle,
  CompanyImage,
  CompanyDetails,
  CompanyIconSize,
} from "./ActiveCompaniesToReserwationCompanyItem.style";
import {Colors} from "@constants";

interface ActiveCompaniesToReserwationCompanyItemProps {
  companyItem: CompanyPropsShowName;
}

const ActiveCompaniesToReserwationCompanyItem: NextPage<
  ISiteProps &
    ITranslatesProps &
    IWithUserProps &
    ActiveCompaniesToReserwationCompanyItemProps
> = ({siteProps, texts, companyItem, router, isMobile}) => {
  const colorNoImage: string = Colors(siteProps).greyColorLight;
  const colorItem: string = Colors(siteProps).greyExtraItem;
  console.log(companyItem);

  const handleClickCompany = () => {
    if (!!companyItem?.companyContact?.url) {
      router?.push(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${companyItem?.companyContact?.url}`
      );
    }
  };

  return (
    <ItemCompanyStyle>
      <CompanyImage colorNoImage={colorNoImage} isMobile={!!isMobile}>
        {!!!companyItem?.companyDetails?.avatarUrl ? (
          <CompanyIconSize>
            <Paragraph color="WHITE_ONLY" marginBottom={0} marginTop={0}>
              <GenerateIcons iconName="PhotographIcon" />
            </Paragraph>
          </CompanyIconSize>
        ) : (
          <ImageNext
            src={companyItem?.companyDetails?.avatarUrl}
            alt="company-image"
            height={250}
            width={300}
          />
        )}
      </CompanyImage>
      <CompanyDetails colorItem={colorItem} isMobile={!!isMobile}>
        <div className="flex-between-start width-100">
          <div>
            <Heading
              tag={2}
              uppercase
              marginTop={0}
              marginBottom={0}
              color="PRIMARY_DARK"
            >
              {companyItem?.companyDetails?.name}
            </Heading>
            <Paragraph marginTop={0}>
              {`${companyItem?.companyContact?.city.placeholder},
            ${companyItem?.companyContact?.district.placeholder},
            ${companyItem?.companyContact?.street.placeholder}`}
            </Paragraph>
          </div>
          <div>x</div>
        </div>
        <div
          className={
            !!isMobile ? "width-100" : "flex-between-center width-100 flex-wrap"
          }
        >
          <div className={!!isMobile ? "mb-10" : "mt-10"}>
            <ButtonIcon
              id="show_change_phone_account_button"
              onClick={() => {}}
              iconName="BriefcaseIcon"
              color="GREY"
              fullWidth={isMobile}
            >
              Usługi
            </ButtonIcon>
          </div>
          <div className={!!isMobile ? "" : "mt-10"}>
            <ButtonIcon
              id="show_change_phone_account_button"
              onClick={handleClickCompany}
              iconName="HomeIcon"
              fullWidth={isMobile}
            >
              Przejdz do firmy
            </ButtonIcon>
          </div>
        </div>
      </CompanyDetails>
    </ItemCompanyStyle>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ActiveCompaniesToReserwationCompanyItem)),
  "ActiveCompaniesToReserwationCompanyItem"
);
