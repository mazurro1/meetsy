import type {UserProps} from "@/models/User/user.model";

export interface IUserProps {
  user?: UserProps;
}

export interface IUpdateUserProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
