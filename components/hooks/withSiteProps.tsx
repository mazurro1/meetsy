import type {ISiteProps, IUserProps} from "@hooks";
import {useSelector} from "react-redux";
import type {NextPage} from "next";
import UseWindowSize from "./useWindowSize";
import type {UseWindowSizeProps} from "./useWindowSize";
import {Site} from "@constants";
import {useRouter} from "next/router";
import type {IStoreProps} from "@/redux/store";
import {useDispatch} from "react-redux";
import type {Dispatch} from "redux";
import {useSession} from "next-auth/react";

const withSiteProps =
  <P extends object>(Component: NextPage<P & ISiteProps>): NextPage<P> =>
  (props: P) => {
    const allSiteProps: ISiteProps = useSelector(
      (state: IStoreProps) => state.site
    );
    const userProps: IUserProps = useSelector(
      (state: IStoreProps) => state.user
    );

    const size: UseWindowSizeProps = UseWindowSize();
    let isDesktop: boolean = false;
    let isMobile: boolean = false;
    if (!!size?.width) {
      isDesktop = Site.mobileSize < size?.width;
    }
    if (!!size?.width) {
      isMobile = Site.mobileSize >= size?.width;
    }
    const router = useRouter();
    const dispatch: Dispatch<any> = useDispatch();
    const {data} = useSession();

    return (
      <Component
        {...(props as P)}
        {...allSiteProps}
        size={size}
        isDesktop={isDesktop}
        isMobile={isMobile}
        router={router}
        dispatch={dispatch}
        session={data}
        {...userProps}
      />
    );
  };
export {withSiteProps};
