import React from "react";
import {NextPage} from "next";
import {RoutesFooter} from "@constants";
import type {RoutesFooterInterface} from "@constants";
import {Paragraph, GenerateIcons, LinkEffect} from "@ui";
import * as styles from "./Footer.style";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Colors} from "@constants";
import type {FooterProps} from "./Footer.model";

const Footer: NextPage<ITranslatesProps & ISiteProps & FooterProps> = ({
  texts,
  siteProps,
}) => {
  const mapRoutes = RoutesFooter.map(
    (item: RoutesFooterInterface, index: number) => {
      return (
        <LinkEffect path={item.path} key={index} color="GREY_LIGHT">
          {item.name}
        </LinkEffect>
      );
    }
  );

  const backgroundColor = Colors(siteProps).navBackground;
  const primaryColor = Colors(siteProps).primaryColor;

  return (
    <styles.WrapperFooter backgroundColor={backgroundColor}>
      <styles.FooterDiv backgroundColor={backgroundColor}>
        <styles.LinkRoutes primaryColor={primaryColor}>
          {mapRoutes}
          <LinkEffect path="/playground" color="WHITE_ONLY">
            Playground
          </LinkEffect>
        </styles.LinkRoutes>
        <styles.FacebookIcon primaryColor={primaryColor}>
          <Paragraph fontSize="SMALL" color="WHITE_ONLY">
            <a
              href={texts?.linkFacebook}
              target="__blank"
              rel="noopener noreferrer"
            >
              <GenerateIcons iconName="TemplateIcon" />
            </a>
          </Paragraph>
        </styles.FacebookIcon>
        <styles.ReservedRights>
          <Paragraph color="GREY_LIGHT" fontSize="SMALL">
            {`©  ${new Date().getFullYear()} ${texts?.copyright}`}
          </Paragraph>
        </styles.ReservedRights>
      </styles.FooterDiv>
    </styles.WrapperFooter>
  );
};

export default withTranslates(withSiteProps(Footer), "Footer");
