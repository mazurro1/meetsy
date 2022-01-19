export interface UserProps {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string;
  isNewFromSocial?: boolean;
  language?: "pl" | "en";
}

export interface IUserProps {
  user: UserProps | null;
}

export interface IUpdateUserProps {
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
