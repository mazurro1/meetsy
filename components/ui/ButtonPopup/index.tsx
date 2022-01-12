import type { NextPage } from "next";
import type { ISiteProps } from "@hooks";
import { ButtonIcon, Popup } from "@ui";
import type { GenerateIconsProps } from "@ui";
import type { ButtonPopupProps } from "./ButtonPopup.model";

const ButtonPopup: NextPage<
  ISiteProps & ButtonPopupProps & GenerateIconsProps
> = ({
  children,
  fontSize = "MEDIUM",
  uppercase = false,
  iconName = "",
  disabled = false,
  id = "",
  isFetchToBlock = false,
  color = "PRIMARY",
  iconPadding = 4,
  title = "",
  closeTitle = true,
  smallTitle = false,
  position = "fixed",
  popupEnable = false,
  handleChangePopup = () => {},
  maxWidth = 900,
}) => {
  return (
    <>
      <ButtonIcon
        fontSize={fontSize}
        uppercase={uppercase}
        iconName={iconName}
        disabled={disabled}
        id={id}
        isFetchToBlock={isFetchToBlock}
        iconPadding={iconPadding}
        onClick={handleChangePopup}
        color={color}
      >
        {title}
      </ButtonIcon>
      <Popup
        popupEnable={popupEnable}
        title={title}
        closeTitle={closeTitle}
        smallTitle={smallTitle}
        position={position}
        color={color}
        handleClose={handleChangePopup}
        maxWidth={maxWidth}
      >
        {children}
      </Popup>
    </>
  );
};

export default ButtonPopup;
