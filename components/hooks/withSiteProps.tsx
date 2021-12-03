import React from "react";
import { useSelector, RootStateOrAny } from "react-redux";

const withSiteProps = (Component: any) => (props: any) => {
  const siteProps = useSelector(
    (state: RootStateOrAny) => state.site.siteProps
  );

  return React.createElement(Component, { ...props, siteProps });
};

export { withSiteProps };
