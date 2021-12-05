import * as IconsSolid from "@heroicons/react/solid";
import * as IconsOutline from "@heroicons/react/outline";
import React from "react";
import type { IconsProps, IconsExtraProps } from "./GenerateIcons.model";
import type { NextPage } from "next";

const GenerateIcons: NextPage<IconsProps & IconsExtraProps> = ({
  iconName = "",
  outline = false,
}) => {
  if (!!iconName) {
    const SelectedIcon: any = outline // @ts-ignore
      ? IconsOutline[iconName] // @ts-ignore
      : IconsSolid[iconName];
    if (!!!SelectedIcon) {
      return null;
    } else {
      return (
        <>
          <SelectedIcon />
        </>
      );
    }
  } else {
    return null;
  }
};

export default GenerateIcons;
