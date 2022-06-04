import {NextPage} from "next";
import {
  ButtonIcon,
  Paragraph,
  GenerateIcons,
  ImageNext,
  Heading,
  Tooltip,
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

  const handleClickCompany = () => {
    if (!!companyItem?.companyContact?.url) {
      router?.push(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${companyItem?.companyContact?.url}`
      );
    }
  };

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
    <div
      data-sal="zoom-in"
      data-sal-duration="500"
      data-sal-easing="ease-out-bounce"
    >
      <ItemCompanyStyle>
        <Tooltip enable text={texts!.goToTheCompany} fullWidth={isMobile}>
          <CompanyImage
            colorNoImage={colorNoImage}
            isMobile={!!isMobile}
            onClick={handleClickCompany}
          >
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
        </Tooltip>
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
            </div>
            <div>x</div>
          </div>
          <div
            className={
              !!isMobile
                ? "width-100"
                : "flex-between-center width-100 flex-wrap"
            }
          >
            <div className={!!isMobile ? "mb-10" : "mt-10"}>Usługi</div>
            <div className={!!isMobile ? "" : "mt-10"}>
              <ButtonIcon
                id="show_change_phone_account_button"
                onClick={handleClickCompany}
                iconName="ArrowRightIcon"
                fullWidth={isMobile}
              >
                {texts!.goToTheCompany}
              </ButtonIcon>
            </div>
          </div>
        </CompanyDetails>
      </ItemCompanyStyle>
    </div>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ActiveCompaniesToReserwationCompanyItem)),
  "ActiveCompaniesToReserwationCompanyItem"
);
