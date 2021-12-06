import React, { useState, useEffect, useRef } from "react";
import { ButtonIcon } from "@ui";
import { CSSTransition } from "react-transition-group";
import * as styled from "./SelectCreated.style";
import { GenerateIcons } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import type { NextPage } from "next";
import { Colors, ColorsInterface } from "@constants";
import { Paragraph } from "@ui";

interface optionPInterface {
  label: string;
  value: string;
}

interface SelectCreatedProps {
  options: optionPInterface[];
  isMulti?: boolean;
  maxMenuHeight?: number;
  closeMenuOnSelect?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  defaultMenuIsOpen?: boolean;
  isDisabled?: boolean;
  value: any;
  handleChange: Function;
  width?: number;
  darkSelect?: boolean;
  onlyText?: boolean;
  deleteItem?: boolean;
  deleteLastItem?: boolean;
  textUp?: boolean;
  top?: boolean;
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
}

const SelectCreated: NextPage<
  ISiteProps & SelectCreatedProps & ISiteProps & ITranslatesProps
> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  options = [],
  isMulti = false,
  maxMenuHeight = 300,
  closeMenuOnSelect = true,
  placeholder = "",
  isClearable = false,
  defaultMenuIsOpen = false,
  isDisabled = false,
  value = null,
  handleChange = () => {},
  width = 300,
  onlyText = false,
  deleteItem = true,
  deleteLastItem = true,
  textUp = false,
  top = false,
  color = "PRIMARY",
  texts,
}) => {
  const [selectActive, setSelectActive] = useState(
    isDisabled ? false : defaultMenuIsOpen
  );
  const [selectedItems, setSelectedItems] = useState<optionPInterface[]>([]);
  const [hoverActive, setHoverActive] = useState(false);
  const refSelect: any = useRef(null);
  const nodeRef = useRef(null);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (refSelect.current && !refSelect.current.contains(event.target)) {
        setSelectActive(defaultMenuIsOpen);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refSelect]);

  useEffect(() => {
    if (!isDisabled) {
      setSelectActive(defaultMenuIsOpen);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (!!value && isMulti) {
      setSelectedItems([...value]);
    } else if (!!value && !isMulti) {
      setSelectedItems([{ ...value }]);
    } else {
      setSelectedItems([]);
    }
  }, [value]);

  const handleClickSelect = () => {
    if (!isDisabled) {
      setSelectActive((prevState) => !prevState);
    }
  };

  const handleClickItem = (e: Event, selectedItem: optionPInterface) => {
    e.preventDefault();
    if (!isDisabled) {
      let valueToSentHandleChange: any = null;
      let valueToSelect = [];

      const isItemInSelected: boolean = selectedItems.some(
        (item) => item.value === selectedItem.value
      );
      if (isItemInSelected) {
        const filterSelectedItem: Array<optionPInterface> =
          selectedItems.filter((item) => item.value !== selectedItem.value);
        valueToSelect = filterSelectedItem;
        if (isMulti) {
          if (!deleteLastItem) {
            const validfilterSelectedItem: Array<optionPInterface> =
              selectedItems.length === 1 ? selectedItems : filterSelectedItem;
            valueToSentHandleChange = validfilterSelectedItem;
          } else {
            valueToSentHandleChange = filterSelectedItem;
          }
        } else {
          const validfilterSelectedItem =
            filterSelectedItem.length > 0 ? filterSelectedItem[0] : null;
          valueToSentHandleChange = validfilterSelectedItem;
        }
      } else {
        if (isMulti) {
          const allSelectedItems: Array<optionPInterface> = [
            ...selectedItems,
            selectedItem,
          ];
          if (isMulti) {
            valueToSentHandleChange = allSelectedItems;
          } else {
            const validallSelectedItems =
              allSelectedItems.length > 0 ? allSelectedItems[0] : null;
            valueToSentHandleChange = validallSelectedItems;
          }
          valueToSelect = allSelectedItems;
        } else {
          if (isMulti) {
            valueToSentHandleChange = [selectedItem];
          } else {
            valueToSentHandleChange = selectedItem;
          }
          valueToSelect = [selectedItem];
        }
      }
      if (closeMenuOnSelect) {
        setSelectActive(false);
      }
      if (deleteItem || deleteLastItem || !!valueToSentHandleChange) {
        handleChange(valueToSentHandleChange);
        setSelectedItems(valueToSelect);
      }
    }
  };

  const handleClearSelect = (e: Event) => {
    e.preventDefault();
    let valueToSentHandle: null | [] = null;
    if (isMulti) {
      valueToSentHandle = [];
    }

    handleChange(valueToSentHandle);
    setSelectedItems([]);
  };

  const handleDeleteSelectedItem = (e: any, selectedItem: optionPInterface) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (deleteItem) {
      if (!isDisabled) {
        const filterSelectedItem = selectedItems.filter(
          (item) => item.value !== selectedItem.value
        );
        setSelectedItems(filterSelectedItem);
        if (isMulti) {
          handleChange(filterSelectedItem);
        } else {
          handleChange(null);
        }
      }
    }
  };

  const handleStopPropagination = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!isDisabled && closeMenuOnSelect) {
      setSelectActive((prevState) => !prevState);
    }
  };

  const handleOnMouseOn = () => {
    setHoverActive(true);
  };

  const handleOnMouseLeave = () => {
    setHoverActive(false);
  };

  selectedItems.sort((a, b) => {
    const firstItemToSort = a.value.toString().toLowerCase();
    const secondItemToSort = b.value.toString().toLowerCase();
    if (firstItemToSort < secondItemToSort) return -1;
    if (firstItemToSort > secondItemToSort) return 1;
    return 0;
  });

  let colorItemBackgroundHover: string = "";
  let colorItemBackground: string = "";
  let colorItemBorderAndActiveBg: string = "";
  let colorItemText: string = "";
  let colorItemTextActive: string = "";
  let colorUpItem: string = "";

  switch (color) {
    case "PRIMARY": {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).primaryColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).primaryColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).secondColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).secondColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).dangerColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).dangerColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).successColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).successColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).greyColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).greyColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorItemText = Colors(sitePropsColors).textBlack;
      colorItemTextActive = Colors(sitePropsColors).textWhite;
      colorItemBackgroundHover = Colors(sitePropsColors).primaryColorLight;
      colorItemBorderAndActiveBg = Colors(sitePropsColors).primaryColorDark;
      colorItemBackground = Colors(sitePropsColors).backgroundColorPage;
      colorUpItem = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  const mapOptions: Array<any> = options.map((item, index) => {
    const isItemActive: boolean = selectedItems.some(
      (itemSelect) => itemSelect.value === item.value
    );
    return (
      <styled.DataItem
        onClick={(e: Event) => handleClickItem(e, item)}
        key={index}
        textColor={isItemActive ? colorItemTextActive : colorItemText}
        backgroundColor={
          isItemActive ? colorItemBorderAndActiveBg : colorItemBackground
        }
        backgroundColorHover={
          isItemActive ? colorItemBorderAndActiveBg : colorItemBackgroundHover
        }
        borderColor={
          isItemActive ? colorItemBackgroundHover : colorItemBorderAndActiveBg
        }
      >
        <span>{item.label}</span>
      </styled.DataItem>
    );
  });

  let validDeleteItem: boolean = false;
  if (deleteItem && deleteLastItem) {
    validDeleteItem = true;
  } else if (deleteItem && !deleteLastItem) {
    if (selectedItems.length > 1) {
      validDeleteItem = true;
    } else {
      validDeleteItem = false;
    }
  }

  const mapSelectedValues: Array<any> = selectedItems.map((item, index) => {
    return (
      <styled.SelectedItemValue
        key={index}
        onClick={handleStopPropagination}
        backgroundColor={hoverActive ? colorItemBorderAndActiveBg : colorUpItem}
        textColor={colorItemTextActive}
        backgroundColorHover={colorItemBorderAndActiveBg}
      >
        <styled.FlexItemSelectedName>
          {item.label}
          {validDeleteItem && (
            <styled.DeleteItemSelected
              onClick={(e) => handleDeleteSelectedItem(e, item)}
              color={colorItemTextActive}
            >
              <GenerateIcons iconName="XIcon" />
            </styled.DeleteItemSelected>
          )}
        </styled.FlexItemSelectedName>
      </styled.SelectedItemValue>
    );
  });

  const placeholderFromTexts: string = !!placeholder
    ? placeholder
    : texts!.placeholder;

  return (
    <styled.SizeSelect width={width} isClearable={isClearable} ref={refSelect}>
      <div
        onMouseEnter={handleOnMouseOn}
        onMouseLeave={handleOnMouseLeave}
        aria-hidden="true"
      >
        {textUp && (
          <Paragraph marginBottom={0.2} marginTop={0}>
            {!!placeholderFromTexts && selectedItems.length > 0 && textUp
              ? placeholderFromTexts
              : ""}
          </Paragraph>
        )}
        <ButtonIcon
          uppercase
          fontSize="MEDIUM"
          iconName="ChevronDownIcon"
          onClick={handleClickSelect}
          disabled={isDisabled}
          id="select_button"
          iconPadding={4}
          color={color}
        >
          {selectedItems.length === 0 ? (
            <Paragraph
              marginBottom={0}
              marginTop={0}
              color="WHITE"
            >{`${placeholderFromTexts}${
              onlyText ? `: ${texts!.none}` : ""
            }`}</Paragraph>
          ) : onlyText ? (
            <Paragraph marginBottom={0} marginTop={0} color="WHITE">
              {placeholderFromTexts}: {mapSelectedValues.length}
            </Paragraph>
          ) : (
            <styled.WrapSelectedElements>
              {mapSelectedValues}
            </styled.WrapSelectedElements>
          )}
        </ButtonIcon>
      </div>
      <CSSTransition
        in={selectActive}
        timeout={400}
        classNames="popup"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <styled.PositionValues
          height={maxMenuHeight}
          isClearable={isClearable}
          borderColor={colorItemBorderAndActiveBg}
          top={top}
          ref={nodeRef}
        >
          {mapOptions}
        </styled.PositionValues>
      </CSSTransition>
      {isClearable && !isDisabled && (
        <styled.ClearSelect onClick={(e: any) => handleClearSelect(e)}>
          <GenerateIcons iconName="XIcon" />
        </styled.ClearSelect>
      )}
    </styled.SizeSelect>
  );
};

export default withTranslates(withSiteProps(SelectCreated), "SelectCreated");
