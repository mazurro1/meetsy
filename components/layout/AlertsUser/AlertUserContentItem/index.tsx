import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import type {AlertUserContentItemProps} from "./AlertUserContentItem.model";
import type {ColorsInterface} from "@constants";
import AlertUserGenerateAlert from "../AlertUserGenerateAlert";

const AlertUserContentItem: NextPage<
  ISiteProps & ITranslatesProps & AlertUserContentItemProps
> = ({
  texts,
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  item,
  isLast,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  return (
    <div
      data-sal="zoom-in"
      data-sal-duration="300"
      data-sal-easing="ease-out-bounce"
    >
      <AlertUserGenerateAlert
        item={item}
        sitePropsColors={sitePropsColors}
        texts={texts}
        isLast={isLast}
      />
    </div>
  );
};

export default withTranslates(
  withSiteProps(AlertUserContentItem),
  "AlertsUser"
);
