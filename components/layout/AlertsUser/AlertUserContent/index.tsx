import {NextPage} from "next";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useEffect, useState, useRef} from "react";
import {FetchData, ScrollBottomAction, HiddenContent, Loader} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import {updateUserAlerts, updateUserAlertsCount} from "@/redux/user/actions";
import AlertUserContentItem from "../AlertUserContentItem";
import {PositionAllAlerts} from "./AlertUserContent.style";
import type {AlertUserContentProps} from "./AlertUserContent.model";
import sal from "sal.js";

const AlertUserContent: NextPage<
  ISiteProps & ITranslatesProps & AlertUserContentProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  isMobile,
  userAlerts,
  isOpen,
  userAlertsCount,
}) => {
  const [isDisabledFetchAlerts, setIsDisabledFetchAlerts] =
    useState<boolean>(false);
  const [selectedPageAlerts, setSelectedPageAlerts] = useState<number>(0);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  const [wasFirstFetch, setWasFirstFetch] = useState<boolean>(false);
  const refAllAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sal({
      threshold: 0.01,
      once: true,
      root: refAllAlerts.current,
    });
  }, [userAlerts, isOpen]);

  const handleFetchAction = () => {
    setLoadingAlerts(true);
    FetchData({
      url: "/api/user/alerts",
      method: "POST",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        page: selectedPageAlerts,
      },
      disabledLoader: true,
      callback: (data) => {
        if (data.success) {
          if (!!data.data.alerts) {
            dispatch!(updateUserAlerts(data.data.alerts));
            setSelectedPageAlerts((prevState) => prevState + 1);
          } else {
            setIsDisabledFetchAlerts(true);
          }
          dispatch!(updateUserAlertsCount(0));
        } else {
          dispatch!(addAlertItem(texts!.errorUpdateAlerts, "RED"));
        }
        setLoadingAlerts(false);
      },
    });
  };

  const handleUpdateActiveAlerts = () => {
    FetchData({
      url: "/api/user/alerts",
      method: "PATCH",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: true,
      callback: (data) => {
        if (data.success) {
          dispatch!(updateUserAlertsCount(0));
        } else {
          dispatch!(addAlertItem(texts!.errorUpdateAlerts, "RED"));
        }
      },
    });
  };

  useEffect(() => {
    if (!wasFirstFetch && !!isOpen) {
      handleFetchAction();
      setWasFirstFetch(true);
    } else if (!!isOpen && !!userAlertsCount) {
      handleUpdateActiveAlerts();
    }
  }, [isOpen]);

  const handleFetchMoreAlerts = () => {
    if (!isDisabledFetchAlerts && !!userAlerts && !!isOpen) {
      handleFetchAction();
    }
  };

  const validUserAlerts = !!userAlerts ? userAlerts : [];

  const allUserAlertsMap = validUserAlerts.map((item, index) => {
    const isLast: boolean = index + 1 === validUserAlerts.length;
    return <AlertUserContentItem key={index} item={item} isLast={isLast} />;
  });

  return (
    <HiddenContent enable={isOpen}>
      <PositionAllAlerts isMobile={!!isMobile}>
        <ScrollBottomAction
          handleScrollAction={handleFetchMoreAlerts}
          paddingY={5}
          lengthItems={validUserAlerts.length}
          refProp={refAllAlerts}
        >
          {allUserAlertsMap}
          <Loader enable={loadingAlerts} />
        </ScrollBottomAction>
      </PositionAllAlerts>
    </HiddenContent>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(AlertUserContent)),
  "AlertsUser"
);
