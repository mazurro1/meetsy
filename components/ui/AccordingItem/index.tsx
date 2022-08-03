import type {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Colors} from "@constants";
import {GenerateIcons, Tooltip} from "@ui";
import {
  AccordingItemStyle,
  IconActionPosition,
  FlexIconPosition,
  FullWidth,
} from "./AccordingItem.style";
import type {AccordingItemProps} from "./AccordingItem.model";

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
  userSelect = false,
  tooltipDelete = "",
  tooltipEdit = "",
}) => {
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

  const colorText: string = Colors(siteProps).textBlack;
  const colorIcon: string = Colors(siteProps).textOnlyWhite;
  let colorBackground: string = "";

  switch (color) {
    case "DEFAULT": {
      colorBackground = Colors(siteProps).greyExtraItem;
      break;
    }
    case "PRIMARY": {
      colorBackground = Colors(siteProps).primaryColorLight;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(siteProps).secondColorLight;
      break;
    }
    case "RED": {
      colorBackground = Colors(siteProps).dangerColorLight;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(siteProps).successColorLight;
      break;
    }
    case "GREY": {
      colorBackground = Colors(siteProps).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(siteProps).primaryColorLight;
      break;
    }
  }

  return (
    <AccordingItemStyle
      backgroundColor={colorBackground}
      color={colorText}
      index={index}
      hasActions={!!handleEdit || !!handleDelete}
      userSelect={userSelect}
    >
      <FullWidth>{children}</FullWidth>
      <FlexIconPosition>
        {!!handleEdit && (
          <Tooltip text={!!tooltipEdit ? tooltipEdit : texts!.edit}>
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
          <Tooltip text={!!tooltipDelete ? tooltipDelete : texts!.delete}>
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
