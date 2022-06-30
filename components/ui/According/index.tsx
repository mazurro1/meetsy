import type {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Colors, ColorsInterface} from "@constants";
import {Collapse} from "react-collapse";
import {useState, useEffect, useRef} from "react";
import sal from "sal.js";
import {GenerateIcons, Tooltip, Heading} from "@ui";
import {
  AccordingStyle,
  TitleCategory,
  IconArrowPosition,
  IconActionPosition,
  PositionArrowDown,
  PositionHandle,
} from "./According.style";
import type {AccordingProps} from "./According.model";

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
  defaultIsOpen = false,
  width = "100%",
  active = null,
  setActive = () => {},
}) => {
  const [collapseActive, setCollapseActive] = useState(defaultIsOpen);
  const refElement = useRef(null);

  // useEffect(() => {
  //   sal({
  //     root: refElement.current,
  //     threshold: 0.1,
  //     once: true,
  //   });
  // }, []);

  useEffect(() => {
    if (active !== null) {
      setCollapseActive(active);
    }
  }, [active]);

  const handleClickCollapse = () => {
    setCollapseActive((prevState) => {
      setActive(!prevState);
      return !prevState;
    });
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

  const colorText: string = Colors(siteProps).textWhite;
  let colorBackground: string = "";

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(siteProps).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(siteProps).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(siteProps).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(siteProps).secondColorDark;
      break;
    }
    case "RED": {
      colorBackground = Colors(siteProps).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(siteProps).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(siteProps).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(siteProps).successColorDark;
      break;
    }
    case "GREY": {
      colorBackground = Colors(siteProps).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(siteProps).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(siteProps).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(siteProps).primaryColor;
      break;
    }
  }

  let countFunctionsInTitle = 1;

  if (!!handleAdd) {
    countFunctionsInTitle += 1;
  }

  if (!!handleEdit) {
    countFunctionsInTitle += 1;
  }

  if (!!handleDelete) {
    countFunctionsInTitle += 1;
  }

  return (
    <AccordingStyle
      // data-sal="zoom-in"
      // data-sal-duration="1000"
      // data-sal-easing="ease-out-bounce"
      marginTop={marginTop}
      marginBottom={marginBottom}
      ref={refElement}
      width={width}
    >
      <TitleCategory
        color={colorText}
        backgroundColor={colorBackground}
        onClick={handleClickCollapse}
        paddingRight={countFunctionsInTitle * 50}
      >
        <Heading color="WHITE" tag={3} marginBottom={0} marginTop={0}>
          {title}
        </Heading>
        <PositionArrowDown>
          <Tooltip text={collapseActive ? texts!.collapse : texts!.noCollapse}>
            <IconArrowPosition collapseActive={collapseActive}>
              <GenerateIcons iconName="ChevronDownIcon" />
            </IconArrowPosition>
          </Tooltip>
        </PositionArrowDown>

        {!!handleAdd && (
          <PositionHandle right={50}>
            <Tooltip text={texts!.add}>
              <IconActionPosition
                onClick={handleAddAccording}
                data-tip
                data-for="addItem"
              >
                <GenerateIcons iconName="DocumentAddIcon" />
              </IconActionPosition>
            </Tooltip>
          </PositionHandle>
        )}
        {!!handleEdit && (
          <PositionHandle right={!!handleAdd ? 100 : 50}>
            <Tooltip text={texts!.edit}>
              <IconActionPosition
                onClick={handleEditAccording}
                data-tip
                data-for="editCategory"
              >
                <GenerateIcons iconName="PencilIcon" />
              </IconActionPosition>
            </Tooltip>
          </PositionHandle>
        )}
        {!!handleDelete && (
          <PositionHandle
            right={
              !!handleAdd ? (!!handleEdit ? 150 : 100) : !!handleEdit ? 100 : 50
            }
          >
            <Tooltip text={texts!.delete}>
              <IconActionPosition
                onClick={handleDeleteAccording}
                data-tip
                data-for="deleteCategory"
              >
                <GenerateIcons iconName="TrashIcon" />
              </IconActionPosition>
            </Tooltip>
          </PositionHandle>
        )}
      </TitleCategory>
      <Collapse isOpened={collapseActive}>
        <div>{children}</div>
      </Collapse>
    </AccordingStyle>
  );
};

export default withTranslates(withSiteProps(According), "According");
