import {NextPage} from "next";
import {GenerateIcons, Paragraph, Tooltip, HiddenContent} from "@ui";
import {Colors} from "@constants";
import {withSiteProps, withTranslates, useOuterClick} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useEffect, useRef} from "react";
import AlertUserContent from "./AlertUserContent";
import {
  BellUserStyle,
  PositionRelatve,
  CountAlertsStyle,
} from "./AlertsUser.style";
import {updateUserAlertsActive} from "@/redux/user/actions";

const AlertUser: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  siteProps,
  userAlertsCount,
  dispatch,
}) => {
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonBellUserRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen && isFirstRender) {
      dispatch!(updateUserAlertsActive());
    } else if (!isFirstRender) {
      setIsFirstRender(true);
    }
  }, [isOpen, isFirstRender]);

  useEffect(
    useOuterClick({
      handleOpen: (value) => {
        setIsOpen(value);
      },
      refElement: buttonBellUserRef,
    })
  );

  const handleClickMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const colorActiveBell: string = Colors(siteProps).primaryColorDark;
  const colorCountAlerts: string = Colors(siteProps).dangerColor;

  return (
    <PositionRelatve>
      <Tooltip text={texts!.alerts} place="bottom" enable={!isOpen}>
        <BellUserStyle
          ref={buttonBellUserRef}
          onClick={handleClickMenu}
          id="bell_alerts_user_button"
          colorActiveBell={colorActiveBell}
          isOpen={isOpen}
        >
          <HiddenContent enable={!!userAlertsCount} effect="opacity">
            <CountAlertsStyle colorCountAlerts={colorCountAlerts}>
              <Paragraph
                color="WHITE"
                marginBottom={0}
                marginTop={0}
                fontSize="SMALL"
              >
                {userAlertsCount}
              </Paragraph>
            </CountAlertsStyle>
          </HiddenContent>
          <Paragraph color="WHITE" marginBottom={0} marginTop={0}>
            <GenerateIcons iconName="BellIcon" />
          </Paragraph>
        </BellUserStyle>
      </Tooltip>
      <AlertUserContent isOpen={isOpen} />
    </PositionRelatve>
  );
};

export default withTranslates(withSiteProps(AlertUser), "AlertsUser");
