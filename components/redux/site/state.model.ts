import type {UseWindowSizeProps} from "@hooks";
import type {NextRouter} from "next/router";
import type {Dispatch} from "redux";
import type {LanguagesProps} from "@Texts";

export interface AlertsProps {
  text: string;
  color: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
  vibrate: boolean;
}

export interface OnlySiteProps {
  siteProps?: {
    blind: boolean;
    dark: boolean;
    language: LanguagesProps;
  };
  disableFetchActions?: boolean;
  alerts?: Array<AlertsProps>;
  size?: UseWindowSizeProps;
  isDesktop?: boolean;
  isMobile?: boolean;
  router?: NextRouter;
  dispatch?: Dispatch<any>;
  loadingVisible: boolean;
}

export type ISiteProps = OnlySiteProps;
