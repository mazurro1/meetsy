import React from "react";
import Link from "next/link";
import { AElement } from "@ui";
import type { NextPage } from "next";
import type { LinkProps } from "./LinkEffect.model";

const LinkEffect: NextPage<LinkProps> = ({
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
}) => {
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
    >
      <span>
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
        >
          {children}
        </AElement>
      </span>
    </Link>
  );
  return <>{selectedLink}</>;
};
export default LinkEffect;
