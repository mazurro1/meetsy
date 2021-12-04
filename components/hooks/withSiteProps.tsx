import type { ISiteProps } from "@hooks";
import { useSelector, RootStateOrAny } from "react-redux";
import type { NextPage } from "next";

const withSiteProps =
  <P extends object>(Component: NextPage<P & ISiteProps>): NextPage<P> =>
  (props: P) => {
    const allSiteProps: ISiteProps = useSelector(
      (state: RootStateOrAny) => state.site
    );
    return <Component {...(props as P)} {...allSiteProps} />;
  };
export { withSiteProps };
