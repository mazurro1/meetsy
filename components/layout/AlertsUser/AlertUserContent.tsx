import {NextPage} from "next";
import styled from "styled-components";
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
import AlertUserContentItem from "./AlertUserContentItem";

const PositionAllAlerts = styled.div<{
  isMobile: boolean;
}>`
  position: absolute;
  display: flex;
  right: ${(props) => (props.isMobile ? "-25px" : 0)};
  top: calc(100% + 10px);
  width: 300px;
  min-height: 100px;
  max-height: 200px;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 5px;
`;

export const LoadingStyle = styled.div`
  width: 40px;
  height: 40px;
  animation-name: spinner;
  animation-duration: 0.9s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

interface AlertUserContentProps {
  isOpen: boolean;
}

const AlertUserContent: NextPage<
  ISiteProps & ITranslatesProps & AlertUserContentProps
> = ({texts, dispatch, user, siteProps, isMobile, userAlerts, isOpen}) => {
  const [isDisabledFetchAlerts, setIsDisabledFetchAlerts] =
    useState<boolean>(false);
  const [selectedPageAlerts, setSelectedPageAlerts] = useState<number>(0);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);

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
          dispatch!(updateUserAlertsCount(0));
          if (!!data.data.alerts) {
            dispatch!(updateUserAlerts(data.data.alerts));
            setSelectedPageAlerts((prevState) => prevState + 1);
          } else {
            setIsDisabledFetchAlerts(true);
          }
        } else {
          dispatch!(addAlertItem("Błąd podczas aktualizacji alertów", "RED"));
        }
        setLoadingAlerts(false);
      },
    });
  };

  useEffect(() => {
    if (!!!userAlerts && !!isOpen) {
      handleFetchAction();
    }
  }, [isOpen]);

  const handleFetchMoreAlerts = () => {
    if (!isDisabledFetchAlerts && !!userAlerts && !!isOpen) {
      handleFetchAction();
    }
  };

  const validUserAlerts = !!userAlerts ? userAlerts : [];

  const allUserAlertsMap = validUserAlerts.map((item, index) => {
    return <AlertUserContentItem key={index} item={item} />;
  });

  return (
    <HiddenContent enable={isOpen}>
      <PositionAllAlerts isMobile={!!isMobile}>
        <ScrollBottomAction
          handleScrollAction={handleFetchMoreAlerts}
          paddingY={5}
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

export default withTranslates(withSiteProps(AlertUserContent), "LoginPage");
