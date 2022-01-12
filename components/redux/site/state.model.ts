import type { UseWindowSizeProps } from "@hooks";
import type { NextRouter } from "next/router";
import type { Dispatch } from "redux";

interface AlertsProps {
  text: string;
  color: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
}

export interface ISiteProps {
  siteProps?: {
    blind: boolean;
    dark: boolean;
    language: "pl" | "en";
  };
  disableFetchActions?: boolean;
  alerts?: Array<AlertsProps>;
  size?: UseWindowSizeProps;
  isDesktop?: boolean;
  isMobile?: boolean;
  router?: NextRouter;
  dispatch?: Dispatch<any>;
}
