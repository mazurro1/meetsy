import React, { useState, useEffect, useRef } from "react";
import { ButtonIcon } from "@ui";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import * as styled from "./SelectCreated.style";
import { GenerateIcons } from "@ui";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import type { NextPage } from "next";
import { Colors, ColorsInterface } from "@constants";

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
  secondColor?: boolean;
  darkSelect?: boolean;
  onlyText?: boolean;
  deleteItem?: boolean;
  textUp?: boolean;
  top?: boolean;
}

const SelectCreated: NextPage<ISiteProps & SelectCreatedProps & ISiteProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  options = [],
  isMulti = false,
  maxMenuHeight = 300,
  closeMenuOnSelect = true,
  placeholder = "Wybierz wartości",
  isClearable = false,
  defaultMenuIsOpen = false,
  isDisabled = false,
  value = null,
  handleChange = () => {},
  width = 300,
  secondColor = false,
  onlyText = false,
  deleteItem = true,
  textUp = false,
  top = false,
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
    setSelectActive(defaultMenuIsOpen);
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
      let valueToSentHandleChange = null;
      let valueToSelect = [];

      const isItemInSelected = selectedItems.some(
        (item) => item.value === selectedItem.value
      );
      if (isItemInSelected) {
        const filterSelectedItem = selectedItems.filter(
          (item) => item.value !== selectedItem.value
        );
        valueToSelect = filterSelectedItem;
        if (isMulti) {
          valueToSentHandleChange = filterSelectedItem;
        } else {
          const validfilterSelectedItem =
            filterSelectedItem.length > 0 ? filterSelectedItem[0] : null;
          valueToSentHandleChange = validfilterSelectedItem;
        }
      } else {
        if (isMulti) {
          const allSelectedItems = [...selectedItems, selectedItem];
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

      if (deleteItem || !!valueToSentHandleChange) {
        handleChange(valueToSentHandleChange);
        setSelectedItems(valueToSelect);
      }
    }
  };

  const handleClearSelect = (e: Event) => {
    e.preventDefault();
    let valueToSentHandle = null;
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

  const mapOptions = options.map((item, index) => {
    const isItemActive = selectedItems.some(
      (itemSelect) => itemSelect.value === item.value
    );
    return (
      <styled.DataItem
        onClick={(e: Event) => handleClickItem(e, item)}
        key={index}
        textColor={Colors(sitePropsColors).textBlack}
        backgroundColor={Colors(sitePropsColors).primaryColor}
        backgroundColorHover={Colors(sitePropsColors).primaryColorDark}
        borderColor={Colors(sitePropsColors).primaryColorDark}
      >
        <span>{item.label}</span>
      </styled.DataItem>
    );
  });

  const mapSelectedValues = selectedItems.map((item, index) => {
    return (
      <styled.SelectedItemValue
        key={index}
        onClick={handleStopPropagination}
        backgroundColor={Colors(sitePropsColors).primaryColor}
        textColor={Colors(sitePropsColors).textBlack}
        backgroundColorHover={Colors(sitePropsColors).primaryColorDark}
      >
        <styled.FlexItemSelectedName>
          {item.label}
          {deleteItem && (
            <styled.DeleteItemSelected
              onClick={(e) => handleDeleteSelectedItem(e, item)}
              color={Colors(sitePropsColors).textBlack}
            >
              <GenerateIcons iconName="XIcon" />
            </styled.DeleteItemSelected>
          )}
        </styled.FlexItemSelectedName>
      </styled.SelectedItemValue>
    );
  });

  return (
    <styled.SizeSelect width={width} isClearable={isClearable} ref={refSelect}>
      <div
        onMouseEnter={handleOnMouseOn}
        onMouseLeave={handleOnMouseLeave}
        aria-hidden="true"
      >
        {textUp && (
          <styled.TextSelect color={Colors(sitePropsColors).textBlack}>
            {!!placeholder && selectedItems.length > 0 && textUp
              ? placeholder
              : ""}
          </styled.TextSelect>
        )}
        <ButtonIcon
          uppercase
          fontSize="MEDIUM"
          iconName="ChevronDownIcon"
          onClick={handleClickSelect}
          disabled={isDisabled}
          id="select_button"
          iconPadding={4}
        >
          {selectedItems.length === 0 ? (
            <styled.DefaultPlaceholderStyle>
              {`${placeholder}${onlyText ? ": Brak" : ""}`}
            </styled.DefaultPlaceholderStyle>
          ) : onlyText ? (
            <styled.DefaultPlaceholderStyle>
              {placeholder}: {mapSelectedValues.length}
            </styled.DefaultPlaceholderStyle>
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
          borderColor={Colors(sitePropsColors).primaryColorDark}
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

export default withSiteProps(SelectCreated);
