import type { NextPage } from "next";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { Colors, ColorsInterface } from "@constants";
import { GenerateIcons, Tooltip } from "@ui";
import {
  AccordingItemStyle,
  IconActionPosition,
  FlexIconPosition,
} from "./AccordingItem.style";
import type { AccordingItemProps } from "./AccordingItem.model";

const AccordingItem: NextPage<
  ITranslatesProps & ISiteProps & AccordingItemProps
> = ({
  texts,
  siteProps,
  color = "DEFAULT",
  handleDelete = null,
  handleEdit = null,
  id = "",
  index = 0,
  children,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  const handleDeleteAccordingItem = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!!handleDelete) {
      handleDelete(id);
    }
  };

  const handleEditAccordingItem = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!!handleEdit) {
      handleEdit(id);
    }
  };

  const colorText: string = Colors(sitePropsColors).textBlack;
  const colorIcon: string = Colors(sitePropsColors).textOnlyWhite;
  let colorBackground: string = "";

  switch (color) {
    case "DEFAULT": {
      colorBackground = Colors(sitePropsColors).greyExtraItem;
      break;
    }
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColorLight;
      break;
    }
  }

  return (
    <AccordingItemStyle
      backgroundColor={colorBackground}
      color={colorText}
      index={index}
      hasActions={!!handleEdit || !!handleDelete}
    >
      <div>{children}</div>
      <FlexIconPosition>
        {!!handleEdit && (
          <Tooltip text={texts!.edit}>
            <IconActionPosition
              onClick={handleEditAccordingItem}
              data-tip
              data-for="editCategory"
              right={0}
              color={colorIcon}
            >
              <GenerateIcons iconName="PencilIcon" />
            </IconActionPosition>
          </Tooltip>
        )}
        {!!handleDelete && (
          <Tooltip text={texts!.delete}>
            <IconActionPosition
              onClick={handleDeleteAccordingItem}
              data-tip
              data-for="deleteCategory"
              right={!!handleEdit ? 40 : 0}
              color={colorIcon}
            >
              <GenerateIcons iconName="TrashIcon" />
            </IconActionPosition>
          </Tooltip>
        )}
      </FlexIconPosition>
    </AccordingItemStyle>
  );
};

export default withTranslates(withSiteProps(AccordingItem), "According");
