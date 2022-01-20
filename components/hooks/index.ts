import { withSiteProps } from "./withSiteProps";
import { ISiteProps } from "@/redux/site/state.model";
import { withTranslates } from "./withTranslates";
import type { ITranslatesProps } from "./withTranslates";
import useLongPress from "./useLongPress";
import useWindowSize from "./useWindowSize";
import type { UseWindowSizeProps } from "./useWindowSize";
import { UserProps } from "@/redux/user/state.model";

export { withSiteProps, withTranslates, useLongPress, useWindowSize };
export type { ISiteProps, ITranslatesProps, UseWindowSizeProps, UserProps };
