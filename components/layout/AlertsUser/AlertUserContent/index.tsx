import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useEffect, useState} from "react";
import {
  FetchData,
  ScrollBottomAction,
  HiddenContent,
  Paragraph,
  GenerateIcons,
  Popup,
} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import {updateUserAlerts, updateUserAlertsCount} from "@/redux/user/actions";
import AlertUserContentItem from "../AlertUserContentItem";
import {PositionAllAlerts, LoadingStyle} from "./AlertUserContent.style";
import type {AlertUserContentProps} from "./AlertUserContent.model";

const AlertUserContent: NextPage<
  ISiteProps & ITranslatesProps & AlertUserContentProps
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

  useEffect(() => {
    if (!wasFirstFetch && !!isOpen) {
      handleFetchAction();
      setWasFirstFetch(true);
    } else if (!!isOpen && !!userAlertsCount) {
      dispatch!(updateUserAlertsCount(0));
      console.warn("To do fetch to reset active user alerts");
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
        >
          {allUserAlertsMap}
          <Popup
            noContent
            popupEnable={loadingAlerts}
            closeUpEnable={false}
            effect="opacity"
            id="loading_user_alerts_popup"
            position="absolute"
          >
            <LoadingStyle>
              <Paragraph color="PRIMARY" marginBottom={0} marginTop={0}>
                <GenerateIcons iconName="RefreshIcon" />
              </Paragraph>
            </LoadingStyle>
          </Popup>
        </ScrollBottomAction>
      </PositionAllAlerts>
    </HiddenContent>
  );
};

export default withTranslates(withSiteProps(AlertUserContent), "AlertsUser");
