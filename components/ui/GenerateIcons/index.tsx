import * as IconsSolid from "@heroicons/react/solid";
import * as IconsOutline from "@heroicons/react/outline";
import React from "react";

const GenerateIcons = (iconName: string = "", outline: boolean = false) => {
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
};

export default GenerateIcons;
