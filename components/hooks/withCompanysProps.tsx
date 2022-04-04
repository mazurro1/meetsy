import {useSelector} from "react-redux";
import type {NextPage} from "next";
import type {IStoreProps} from "@/redux/store";
import type {ICompanyProps} from "@/redux/companys/state.model";

const withCompanysProps =
  <P extends object>(Component: NextPage<P & ICompanyProps>): NextPage<P> =>
  (props: P) => {
    const companys: ICompanyProps = useSelector(
      (state: IStoreProps) => state.companys
    );

    return <Component {...(props as P)} {...companys} />;
  };
export type ICompanysProps = ICompanyProps;
export {withCompanysProps};
