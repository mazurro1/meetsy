import React from "react";
import {NextPage} from "next";
import {RoutesFooter} from "@constants";
import type {RoutesFooterInterface} from "@constants";
import {Paragraph, GenerateIcons, LinkEffect} from "@ui";
import * as styles from "./Footer.style";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {Colors} from "@constants";
import type {FooterProps} from "./Footer.model";
import {EnumUserPermissions} from "@/models/User/user.model";

const Footer: NextPage<
  ITranslatesProps & ISiteProps & FooterProps & IUserProps
> = ({texts, siteProps, user}) => {
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

  let isAdminAccount = false;

  if (!!user) {
    if (!!user?.permissions) {
      isAdminAccount = user.permissions.some(
        (item) => item === EnumUserPermissions.admin
      );
    }
  }

  return (
    <styles.WrapperFooter backgroundColor={backgroundColor}>
      <styles.FooterDiv backgroundColor={backgroundColor}>
        <styles.LinkRoutes primaryColor={primaryColor}>
          {mapRoutes}
          {isAdminAccount && (
            <LinkEffect path="/admin" enableLoader color="GREY_LIGHT">
              {texts?.adminPage}
            </LinkEffect>
          )}
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

export default withTranslates(withSiteProps(withUserProps(Footer)), "Footer");
