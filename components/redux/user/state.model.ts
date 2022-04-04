import type {UserProps} from "@/models/User/user.model";
import type {AlertProps} from "@/models/Alert/alert.model";

export interface IUserProps {
  user?: UserProps;
  userAlertsCount?: number;
  userAlerts?: AlertProps[] | null;
}

export interface IUpdateUserProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
