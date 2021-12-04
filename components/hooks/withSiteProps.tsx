import React from "react";
import type { ISiteProps } from "@hooks";
import { useSelector, RootStateOrAny } from "react-redux";

const withSiteProps =
  <P extends object>(
    Component: React.ComponentType<P & ISiteProps>
  ): React.ComponentType<P> =>
  (props: P) => {
    const siteProps: ISiteProps = useSelector(
      (state: RootStateOrAny) => state.site
    );
    return <Component {...(props as P)} {...siteProps} />;
  };
export { withSiteProps };
