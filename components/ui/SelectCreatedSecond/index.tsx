import type { NextPage } from "next";
import { SelectCreatedProps } from "./SelectCreated.model";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { SelectStyle, OptionStyle } from "./SelectCreated.style";

const SelectCreated: NextPage<SelectCreatedProps & ISiteProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  children,
  color = "BLACK",
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorText: string = "";
  let colorSelect: string = "";

  switch (color) {
    case "PRIMARY": {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorText = Colors(sitePropsColors).textWhite;
      colorSelect = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  return (
    <SelectStyle
      name="pets"
      id="pet-select"
      colorText={colorText}
      colorSelect={colorSelect}
    >
      <OptionStyle value="">--Please choose an option--</OptionStyle>
      <OptionStyle value="dog">Dog</OptionStyle>
      <OptionStyle value="cat">Cat</OptionStyle>
      <OptionStyle value="hamster">Hamster</OptionStyle>
      <OptionStyle value="parrot">Parrot</OptionStyle>
      <OptionStyle value="spider">Spider</OptionStyle>
      <OptionStyle value="goldfish">Goldfish</OptionStyle>
    </SelectStyle>
  );
};

export default withSiteProps(SelectCreated);
