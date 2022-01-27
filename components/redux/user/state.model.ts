import type { IUserPropsClient } from "@/models/user";

export interface UserProps {
  user: IUserPropsClient | null;
}

export interface IUpdateUserProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
