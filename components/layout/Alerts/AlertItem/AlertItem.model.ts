import { ColorsInterface } from "@constants";
import { AlertsProps } from "@/redux/site/state.model";

export interface AlertProps {
  item: AlertsProps;
  index: number;
  alertHeight: number;
  sitePropsColors: ColorsInterface;
  id: string;
}
