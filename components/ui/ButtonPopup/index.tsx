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
  titleButton = "",
  closeTitle = true,
  smallTitle = false,
  position = "fixed",
  popupEnable = false,
  handleChangePopup = () => {},
  handleClose = () => {},
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
        {!!titleButton ? titleButton : title}
      </ButtonIcon>
      <Popup
        popupEnable={popupEnable}
        title={title}
        closeTitle={closeTitle}
        smallTitle={smallTitle}
        position={position}
        color={color}
        handleClose={handleClose}
        maxWidth={maxWidth}
        id={id}
        data-test-id={id}
      >
        {children}
      </Popup>
    </>
  );
};

export default ButtonPopup;
