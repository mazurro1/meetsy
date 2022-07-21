import React, {useState, useEffect} from "react";
import Link from "next/link";
import {AElement, Loader} from "@ui";
import type {NextPage} from "next";
import type {LinkProps} from "./LinkEffect.model";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";

const LinkEffect: NextPage<LinkProps & ISiteProps> = ({
  path = "/",
  query = {},
  color = "BLACK",
  spanColor = "BLACK",
  bold = false,
  spanBold = false,
  marginTop = 0,
  marginBottom = 0,
  uppercase = false,
  underline = false,
  letterSpacing = 0,
  children,
  replace = false,
  fontSize = "MEDIUM",
  inNewWindow = false,
  enableLoader = false,
  router,
}) => {
  const [loaderEnable, setLoaderEnable] = useState<boolean>(false);

  useEffect(() => {
    setLoaderEnable(false);
  }, [router?.pathname]);

  const handleClick = () => {
    if (!inNewWindow && enableLoader) {
      if (router?.asPath !== path) {
        setLoaderEnable(true);
      }
    }
  };

  const selectedLink = inNewWindow ? (
    <AElement
      color={color}
      spanColor={spanColor}
      bold={bold}
      spanBold={spanBold}
      marginTop={marginTop}
      marginBottom={marginBottom}
      uppercase={uppercase}
      underline={underline}
      letterSpacing={letterSpacing}
      fontSize={fontSize}
      target="__blank"
      path={path}
    >
      {children}
    </AElement>
  ) : (
    <Link
      href={{
        pathname: path,
        query: query,
      }}
      replace={replace}
      passHref
    >
      <span>
        <AElement
          onClick={handleClick}
          color={color}
          spanColor={spanColor}
          bold={bold}
          spanBold={spanBold}
          marginTop={marginTop}
          marginBottom={marginBottom}
          uppercase={uppercase}
          underline={underline}
          letterSpacing={letterSpacing}
          fontSize={fontSize}
        >
          {children}
        </AElement>
      </span>
    </Link>
  );
  return (
    <>
      <Loader enable={loaderEnable} position="fixed" zIndex={100} />
      {selectedLink}
    </>
  );
};
export default withSiteProps(LinkEffect);
