import {NextPage} from "next";
import {GenerateIcons, Paragraph, Tooltip} from "@ui";
import {Colors} from "@constants";
import styled from "styled-components";
import {withSiteProps, withTranslates, useOuterClick} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useEffect, useRef} from "react";
import {CSSTransition} from "react-transition-group";

const BellUserStyle = styled.button<{
  colorActiveBell: string;
  isOpen: boolean;
}>`
  background-color: ${(props) =>
    props.isOpen ? props.colorActiveBell : "rgba(0, 0, 0, 0.2)"};
  padding: 4px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  overflow-y: auto;
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

const PositionAllAlerts = styled.div<{
  isMobile: boolean;
}>`
  position: absolute;
  right: ${(props) => (props.isMobile ? "-25px" : 0)};
  top: calc(100% + 10px);
  width: 300px;
  min-height: 100px;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 5px;
  padding: 5px 10px;
`;

const AlertUser: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  dispatch,
  user,
  siteProps,
  isMobile,
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

  console.log("isOpen", isOpen);

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
          <Paragraph color="WHITE" marginBottom={0} marginTop={0}>
            <GenerateIcons iconName="BellIcon" />
          </Paragraph>
        </BellUserStyle>
      </Tooltip>
      <CSSTransition in={isOpen} timeout={400} classNames="popup" unmountOnExit>
        <PositionAllAlerts isMobile={!!isMobile}>xdd</PositionAllAlerts>
      </CSSTransition>
      {/* <Popup id="bell_alerts_user_popup" >xdd</Popup> */}
    </PositionRelatve>
  );
};

export default withTranslates(withSiteProps(AlertUser), "LoginPage");
