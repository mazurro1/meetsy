import {useSelector} from "react-redux";
import type {NextPage} from "next";
import type {IStoreProps} from "@/redux/store";
import {useSession} from "next-auth/react";
import type {IUserProps} from "@/redux/user/state.model";
import type {Session} from "next-auth";

interface WithSession {
  session?: null | Session;
}

export type IWithUserProps = IUserProps & WithSession;

const withUserProps =
  <P extends object>(Component: NextPage<P & IWithUserProps>): NextPage<P> =>
  (props: P) => {
    const userProps: IUserProps = useSelector(
      (state: IStoreProps) => state.user
    );

    const {data} = useSession();

    return <Component {...(props as P)} session={data} {...userProps} />;
  };
export {withUserProps};
