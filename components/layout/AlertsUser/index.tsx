import {NextPage} from "next";
import {GenerateIcons, Paragraph, Tooltip, HiddenContent} from "@ui";
import {Colors} from "@constants";
import styled from "styled-components";
import {withSiteProps, withTranslates, useOuterClick} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useEffect, useRef} from "react";
import AlertUserContent from "./AlertUserContent";

const BellUserStyle = styled.button<{
  colorActiveBell: string;
  isOpen: boolean;
}>`
  position: relative;
  background-color: ${(props) =>
    props.isOpen ? props.colorActiveBell : "rgba(0, 0, 0, 0.2)"};
  padding: 4px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  svg {
    height: 21px;
  }
  p {
    line-height: 0px;
  }
  &:hover {
    svg {
      animation-name: ringing;
      animation-duration: 1s;
      animation-timing-function: inline;
      animation-iteration-count: 1;
    }
  }
`;

const PositionRelatve = styled.div`
  position: relative;
`;

const CountAlertsStyle = styled.div<{
  colorCountAlerts: string;
}>`
  position: absolute;
  bottom: 70%;
  left: 80%;
  padding: 10px 5px;
  border-radius: 5px;
  background-color: ${(props) => props.colorCountAlerts};
  user-select: none;
`;

const AlertUser: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  dispatch,
  user,
  siteProps,
  userAlertsCount,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonBellUserRef = useRef<HTMLButtonElement>(null);

  useEffect(
    useOuterClick({
      setIsOpen: setIsOpen,
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
      <Tooltip text={"Powiadomienia"} place="bottom" enable={!isOpen}>
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

export default withTranslates(withSiteProps(AlertUser), "LoginPage");
