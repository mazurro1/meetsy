import type {NextPage} from "next";
import {Popup, Paragraph, GenerateIcons} from "@ui";
import {LoadingStyle} from "./Loader.style";
import {LoaderProps} from "./Loader.model";

const Loader: NextPage<LoaderProps> = ({enable = false, size = 40}) => {
  return (
    <Popup
      noContent
      popupEnable={enable}
      closeUpEnable={false}
      effect="opacity"
      id="loading_user_alerts_popup"
      position="absolute"
    >
      <LoadingStyle size={size}>
        <Paragraph color="PRIMARY" marginBottom={0} marginTop={0}>
          <GenerateIcons iconName="RefreshIcon" />
        </Paragraph>
      </LoadingStyle>
    </Popup>
  );
};

export default Loader;
