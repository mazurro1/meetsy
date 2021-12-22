import type { ISiteProps } from "@hooks";
import { useSelector, RootStateOrAny } from "react-redux";
import type { NextPage } from "next";
import UseWindowSize from "./useWindowSize";
import type { UseWindowSizeProps } from "./useWindowSize";

const withSiteProps =
  <P extends object>(Component: NextPage<P & ISiteProps>): NextPage<P> =>
  (props: P) => {
    const allSiteProps: ISiteProps = useSelector(
      (state: RootStateOrAny) => state.site
    );
    const size: UseWindowSizeProps = UseWindowSize();
    return <Component {...(props as P)} {...allSiteProps} size={size} />;
  };
export { withSiteProps };
