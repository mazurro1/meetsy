import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { useSelector, RootStateOrAny } from "react-redux";
import type { ISiteProps } from "@hooks";
import { ColorsInterface } from "@constants";
import AlertItem from "./AlertItem";
import { PositionAlerts } from "./Alerts.style";
import type { CountHeightProps } from "./Alerts.model";

const Alerts: NextPage = () => {
  const [heightPrevAlerts, setHeightPrevAlerts] = useState<CountHeightProps[]>(
    []
  );
  const allSiteProps: ISiteProps = useSelector(
    (state: RootStateOrAny) => state.site
  );

  const sitePropsColors: ColorsInterface = {
    blind: allSiteProps.siteProps!.blind,
    dark: allSiteProps.siteProps!.dark,
  };

  const refAlerts: React.MutableRefObject<any> = useRef(null);

  useEffect(() => {
    if (!!refAlerts) {
      if (!!refAlerts.current) {
        let countHeight: CountHeightProps[] = [];
        const array: Array<any> = Array.from(refAlerts.current.childNodes);
        array.forEach((itemAlert, index) => {
          countHeight.push({
            id: itemAlert.id,
            height: itemAlert.clientHeight,
            indexToValid: index,
          });
        });
        setHeightPrevAlerts(countHeight as any);
      }
    }
  }, [allSiteProps.alerts]);

  const mapAlerts = allSiteProps.alerts?.map((item, index) => {
    let alertHeight: number = 0;
    heightPrevAlerts.forEach((heightPrevItem: CountHeightProps) => {
      if (heightPrevItem.indexToValid < index) {
        alertHeight = alertHeight + heightPrevItem.height;
      }
    });

    return (
      <AlertItem
        key={item.id}
        id={item.id}
        item={item}
        index={index}
        alertHeight={alertHeight}
        sitePropsColors={sitePropsColors}
      />
    );
  });
  return <PositionAlerts ref={refAlerts}>{mapAlerts}</PositionAlerts>;
};

export default Alerts;
