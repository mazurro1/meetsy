import type {NextPage} from "next";
import {Colors, ColorsInterface} from "@constants";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import styled from "styled-components";
import {Tooltip, Paragraph, GenerateIcons, Button} from "@ui";
import type {IconsProps} from "@ui";

export const BellUserStyle = styled.div`
  position: relative;
  svg {
    height: 21px;
  }
`;

export const PositionRelatve = styled.div`
  position: relative;
`;

export const CountAlertsStyle = styled.div<{
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

interface TitlePageProps {
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  onClick: () => void;
  tooltip?: string;
  id: string;
}

const IconClicked: NextPage<ISiteProps & TitlePageProps & IconsProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  onClick,
  color = "PRIMARY",
  iconName,
  tooltip = "",
  id = "",
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorBackground: string = "";

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  const handleClickIcon = () => {
    onClick();
  };

  return (
    <PositionRelatve>
      <BellUserStyle id="bell_alerts_user_button">
        <Button
          onClick={handleClickIcon}
          id={id}
          tooltip={tooltip}
          color={color}
          colorHover={`${color}_DARK`}
        >
          <Paragraph color="WHITE" marginBottom={0} marginTop={0}>
            <GenerateIcons iconName={iconName} />
          </Paragraph>
        </Button>
      </BellUserStyle>
    </PositionRelatve>
  );
};

export default withSiteProps(IconClicked);
