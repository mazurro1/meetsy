import type {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import {useEffect, useState} from "react";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Popup, ButtonIcon, Paragraph} from "@ui";

interface DetectChangesProps {
  activeChanges: boolean;
}

const DetectChanges: NextPage<
  DetectChangesProps & ISiteProps & ITranslatesProps
> = ({children, router, activeChanges, texts}) => {
  const [urlToChange, setUrlToChange] = useState<string | null>(null);
  const [enablePopup, setEnablePopup] = useState<boolean>(false);
  const [enableChanges, setEnableChanges] = useState<boolean>(false);

  const routeChangeStart = (url: string) => {
    if (activeChanges) {
      setUrlToChange(url);
      const isTheSamePath = router?.pathname === url;
      if (!enableChanges && !isTheSamePath) {
        setEnablePopup(true);
        router?.events.emit("routeChangeError");
        throw "Abort route change. Please ignore this error.";
      }
    } else {
      setUrlToChange(null);
    }
  };

  useEffect(() => {
    router?.events.on("routeChangeStart", routeChangeStart);
    return () => {
      router?.events.off("routeChangeStart", routeChangeStart);
    };
  }, [activeChanges, enableChanges]);

  const handleCancel = () => {
    setEnablePopup(false);
    setUrlToChange(null);
    setEnableChanges(false);
  };

  const handleConfirm = () => {
    setEnablePopup(false);
    if (!!urlToChange) {
      setEnableChanges(true);
      router?.push(urlToChange);
    }
  };

  return (
    <>
      <Popup
        id="detect_changes_popup"
        popupEnable={enablePopup}
        maxWidth={600}
        title={texts!.title}
        closeTitle={false}
      >
        <Paragraph marginTop={0}>{texts!.alertChangePage}</Paragraph>
        <div className="flex-end-center flex-wrap">
          <div className="mt-5">
            <ButtonIcon
              id="detect_changes_cancel_button"
              onClick={handleCancel}
              color="GREEN"
              iconName="ArrowLeftIcon"
            >
              {texts!.stayOnSite}
            </ButtonIcon>
          </div>
          <div className="ml-10 mt-5">
            <ButtonIcon
              id="detect_changes_confirm_button"
              onClick={handleConfirm}
              color="RED"
              iconName="BanIcon"
            >
              {texts!.changeSite}
            </ButtonIcon>
          </div>
        </div>
      </Popup>
      {children}
    </>
  );
};

export default withSiteProps(withTranslates(DetectChanges, "DetectChanges"));
