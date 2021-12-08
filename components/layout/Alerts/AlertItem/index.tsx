import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import { Colors } from "@constants";
import { CSSTransition } from "react-transition-group";
import { GenerateIcons } from "@ui";
import { removeAlertItem } from "@/redux/site/actions";
import {
  OneAlert,
  ContentAlert,
  IconClose,
  StyleIconInfo,
} from "./AlertItem.style";
import type { AlertProps } from "./AlertItem.model";

const AlertItem: NextPage<AlertProps> = ({
  item,
  index,
  alertHeight,
  sitePropsColors,
  id,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const timerToClearSomewhere: React.MutableRefObject<any> = useRef(null);
  const nodeRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isNew) {
      setTimeout(() => {
        setAlertVisible(true);
        setIsNew(false);
      }, 10);

      timerToClearSomewhere.current = setTimeout(() => {
        setAlertVisible(false);
      }, 10000);
    }
  }, [isNew]);

  useEffect(() => {
    if (!alertVisible && !isNew) {
      setTimeout(() => {
        dispatch(removeAlertItem(item.id));
      }, 400);
    }
  }, [alertVisible, isNew, item.id, dispatch]);

  const handleClose = () => {
    clearTimeout(timerToClearSomewhere.current);
    setAlertVisible(false);
  };

  let colorAlert: string = "";
  const colorClose: string = Colors(sitePropsColors).textWhite;

  switch (item.color) {
    case "PRIMARY": {
      colorAlert = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorAlert = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorAlert = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorAlert = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorAlert = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorAlert = Colors(sitePropsColors).primaryColorDark;
      break;
    }
  }

  return (
    <CSSTransition
      in={alertVisible}
      timeout={500}
      classNames="alert"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <OneAlert index={index} alertHeight={alertHeight} ref={nodeRef} id={id}>
        <ContentAlert color={colorAlert}>
          {item.text}
          <IconClose color={colorClose} onClick={handleClose}>
            <GenerateIcons iconName="XIcon" />
          </IconClose>
          <StyleIconInfo>
            <GenerateIcons iconName="InformationCircleIcon" />
          </StyleIconInfo>
        </ContentAlert>
      </OneAlert>
    </CSSTransition>
  );
};

export default AlertItem;
