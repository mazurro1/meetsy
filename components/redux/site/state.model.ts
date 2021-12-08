interface AlertsProps {
  text: string;
  color: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
}

export interface ISiteProps {
  siteProps: {
    blind: boolean;
    dark: boolean;
    language: "pl" | "en";
  };
  disableFetchActions: boolean;
  alerts: Array<AlertsProps>;
}
