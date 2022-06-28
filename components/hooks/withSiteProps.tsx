import type {ISiteProps} from "@hooks";
import {useSelector} from "react-redux";
import type {NextPage} from "next";
import UseWindowSize from "./useWindowSize";
import type {UseWindowSizeProps} from "./useWindowSize";
import {Site} from "@constants";
import {useRouter} from "next/router";
import type {IStoreProps} from "@/redux/store";
import {useDispatch} from "react-redux";
import type {Dispatch} from "redux";
import {useEffect, useState} from "react";

const withSiteProps =
  <P extends object>(Component: NextPage<P & ISiteProps>): NextPage<P> =>
  (props: P) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const allSiteProps: ISiteProps = useSelector(
      (state: IStoreProps) => state.site
    );

    const size: UseWindowSizeProps = UseWindowSize();

    useEffect(() => {
      if (!!size?.width) {
        setIsMobile(Site.mobileSize >= size?.width);
      }
      if (!!size?.width) {
        setIsDesktop(Site.mobileSize < size?.width);
      }
    }, [size]);

    const router = useRouter();
    const dispatch: Dispatch<any> = useDispatch();

    return (
      <Component
        {...(props as P)}
        {...allSiteProps}
        size={size}
        isDesktop={isDesktop}
        isMobile={isMobile}
        router={router}
        dispatch={dispatch}
      />
    );
  };
export {withSiteProps};
