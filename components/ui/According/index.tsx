import type { NextPage } from "next";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { Colors, ColorsInterface } from "@constants";
import { Collapse } from "react-collapse";
import { useState, useEffect, useRef } from "react";
import sal from "sal.js";
import { GenerateIcons, Tooltip, Heading } from "@ui";
import {
  AccordingStyle,
  TitleCategory,
  IconArrowPosition,
  IconActionPosition,
} from "./According.style";
import type { AccordingProps } from "./According.model";

const According: NextPage<ITranslatesProps & ISiteProps & AccordingProps> = ({
  texts,
  siteProps,
  color = "PRIMARY",
  children,
  title = "",
  marginTop = 2,
  marginBottom = 2,
  id = "",
  handleDelete = null,
  handleEdit = null,
  handleAdd = null,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  const [collapseActive, setCollapseActive] = useState(false);
  const refElement = useRef(null);

  useEffect(() => {
    sal({
      root: refElement.current,
      threshold: 0.1,
      once: true,
    });
  }, []);

  const handleClickCollapse = () => {
    setCollapseActive((prevState) => !prevState);
  };

  const handleDeleteAccording = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!!handleDelete) {
      handleDelete(id);
    }
  };

  const handleEditAccording = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!!handleEdit) {
      handleEdit(id);
    }
  };

  const handleAddAccording = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!!handleAdd) {
      handleAdd(id);
    }
  };

  const colorText: string = Colors(sitePropsColors).textWhite;
  let colorBackground: string = "";

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  return (
    <AccordingStyle
      data-sal="zoom-in"
      data-sal-duration="1000"
      data-sal-easing="ease-out-bounce"
      marginTop={marginTop}
      marginBottom={marginBottom}
      ref={refElement}
    >
      <TitleCategory
        color={colorText}
        backgroundColor={colorBackground}
        onClick={handleClickCollapse}
      >
        <Heading color="WHITE" tag={3} marginBottom={0} marginTop={0}>
          {title}
        </Heading>
        <Tooltip text={collapseActive ? texts!.collapse : texts!.noCollapse}>
          <IconArrowPosition collapseActive={collapseActive}>
            <GenerateIcons iconName="ChevronDownIcon" />
          </IconArrowPosition>
        </Tooltip>

        {!!handleAdd && (
          <Tooltip text={texts!.add}>
            <IconActionPosition
              onClick={handleAddAccording}
              data-tip
              data-for="addItem"
              right={50}
            >
              <GenerateIcons iconName="DocumentAddIcon" />
            </IconActionPosition>
          </Tooltip>
        )}
        {!!handleEdit && (
          <Tooltip text={texts!.edit}>
            <IconActionPosition
              onClick={handleEditAccording}
              data-tip
              data-for="editCategory"
              right={!!handleAdd ? 100 : 50}
            >
              <GenerateIcons iconName="PencilIcon" />
            </IconActionPosition>
          </Tooltip>
        )}
        {!!handleDelete && (
          <Tooltip text={texts!.delete}>
            <IconActionPosition
              onClick={handleDeleteAccording}
              data-tip
              data-for="deleteCategory"
              right={
                !!handleAdd
                  ? !!handleEdit
                    ? 150
                    : 100
                  : !!handleEdit
                  ? 100
                  : 50
              }
            >
              <GenerateIcons iconName="TrashIcon" />
            </IconActionPosition>
          </Tooltip>
        )}
      </TitleCategory>
      <Collapse isOpened={collapseActive}>
        <div>{children}</div>
      </Collapse>
    </AccordingStyle>
  );
};

export default withTranslates(withSiteProps(According), "According");
