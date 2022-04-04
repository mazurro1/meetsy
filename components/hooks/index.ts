import {withSiteProps} from "./withSiteProps";
import {ISiteProps} from "@/redux/site/state.model";
import {withTranslates} from "./withTranslates";
import type {ITranslatesProps} from "./withTranslates";
import useLongPress from "./useLongPress";
import useWindowSize from "./useWindowSize";
import type {UseWindowSizeProps} from "./useWindowSize";
import {IUserProps} from "@/redux/user/state.model";
import useOuterClick from "./useOuterClick";
import {withCompanysProps} from "./withCompanysProps";
import type {ICompanysProps} from "./withCompanysProps";
import {withUserProps} from "./withUserProps";
import type {IWithUserProps} from "./withUserProps";

export {
  withSiteProps,
  withTranslates,
  useLongPress,
  useWindowSize,
  useOuterClick,
  withCompanysProps,
  withUserProps,
};
export type {
  ISiteProps,
  ITranslatesProps,
  UseWindowSizeProps,
  IUserProps,
  ICompanysProps,
  IWithUserProps,
};
