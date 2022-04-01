import type {NextPage} from "next";
import {Colors} from "@constants";
import {
  NavUpStyle,
  PositionElementsNav,
  MenuStyle,
  PositionRightElements,
  LogoStyle,
} from "./NavigationUp.style";
import {PageSegment, Paragraph, GenerateIcons, ButtonIcon} from "@ui";
import type {NavigationUpProps} from "./NavigationUp.model";
import AlertUser from "../AlertsUser/index";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";

const NavigationUp: NextPage<
  ISiteProps & ITranslatesProps & NavigationUpProps
> = ({siteProps, handleChangeMenu, router, user, isMobile, texts}) => {
  const handleClickButton = (path: string) => {
    router?.push(path);
  };

  let userHasActionToDo: boolean = false;
  let userHasNewPhoneToConfirm: boolean = false;
  let userHasNewEmailToConfirm: boolean = false;

  if (!!user) {
    if (!!user.userDetails && !!user.phoneDetails) {
      userHasActionToDo =
        !!!user.userDetails!.hasPassword ||
        !!!user.userDetails!.emailIsConfirmed ||
        !!!user.phoneDetails!.has ||
        !!!user.phoneDetails!.isConfirmed;
    }
    userHasNewPhoneToConfirm = !!user.phoneDetails.toConfirmNumber;
    userHasNewPhoneToConfirm = !!user.userDetails.toConfirmEmail;
  }

  const buttonsNav = !!user ? (
    <>
      <div className="mr-10">
        <ButtonIcon
          id="create_company_button"
          onClick={() => handleClickButton("/account/companys/create")}
          fontSize="SMALL"
          iconName="BriefcaseIcon"
        >
          {texts!.createCompany}
        </ButtonIcon>
      </div>
      <div className="mr-10">
        <ButtonIcon
          id="create_company_button"
          onClick={() => handleClickButton("/account/companys")}
          fontSize="SMALL"
          iconName="BriefcaseIcon"
          color="SECOND"
        >
          Twoje firmy
        </ButtonIcon>
      </div>
      <div className="mr-10">
        <ButtonIcon
          id="button_registration"
          iconName={userHasActionToDo ? "ExclamationIcon" : "UserIcon"}
          onClick={() => handleClickButton("/account")}
          fontSize="SMALL"
          capitalize
          color={
            userHasActionToDo
              ? "RED"
              : userHasNewPhoneToConfirm || userHasNewEmailToConfirm
              ? "SECOND"
              : "PRIMARY"
          }
          image={!!user.userDetails.avatarUrl ? user.userDetails.avatarUrl : ""}
        >
          {`${user.userDetails.name} ${user.userDetails.surname}`}
        </ButtonIcon>
      </div>
      <div className={!!isMobile ? "mr-20" : "mr-50"}>
        <AlertUser />
      </div>
    </>
  ) : (
    <>
      <div className="mr-10">
        <ButtonIcon
          id="button_registration"
          iconName="UserAddIcon"
          onClick={() => handleClickButton("/registration")}
          fontSize="SMALL"
        >
          {texts!.registration}
        </ButtonIcon>
      </div>
      <div className={!!isMobile ? "mr-20" : "mr-50"}>
        <ButtonIcon
          id="button_login"
          iconName="UserIcon"
          onClick={() => handleClickButton("/login")}
          fontSize="SMALL"
        >
          {texts!.login}
        </ButtonIcon>
      </div>
    </>
  );

  const navBackgroundColor: string = Colors(siteProps).navBackground;
  const primaryColor: string = Colors(siteProps).primaryColor;

  return (
    <>
      <NavUpStyle navBackgroundColor={navBackgroundColor}>
        <PageSegment id="navigation_up">
          <PositionElementsNav>
            <LogoStyle onClick={() => handleClickButton("/")}>
              <Paragraph
                color="WHITE_ONLY"
                marginBottom={0}
                marginTop={0}
                fontSize="LARGE"
                uppercase
              >
                {texts!.companyName}
              </Paragraph>
            </LogoStyle>
            <PositionRightElements>
              {buttonsNav}
              <MenuStyle onClick={handleChangeMenu} primaryColor={primaryColor}>
                <Paragraph
                  color="WHITE_ONLY"
                  marginBottom={0}
                  marginTop={0}
                  fontSize="LARGE"
                  uppercase
                >
                  <GenerateIcons iconName="MenuIcon" />
                </Paragraph>
              </MenuStyle>
            </PositionRightElements>
          </PositionElementsNav>
        </PageSegment>
      </NavUpStyle>
    </>
  );
};

export default withSiteProps(withTranslates(NavigationUp, "NavigationUp"));
