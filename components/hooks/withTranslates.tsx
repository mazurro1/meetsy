import type { ISiteProps } from "@hooks";
import { useSelector } from "react-redux";
import type { NextPage } from "next";
import { AllTexts } from "@Texts";
import type { AllTextsProps } from "@Texts";
import type { IStoreProps } from "@/redux/store";

export interface ITranslatesProps {
  texts?: {
    [propName: string]: string;
  };
}

export const withTranslates =
  <P extends object>(Component: NextPage<P>, selection: string): NextPage<P> =>
  (props: P) => {
    const allSiteProps: ISiteProps = useSelector(
      (state: IStoreProps) => state.site
    );
    let texts: ITranslatesProps | {} = {};
    let selectedTextsWithLanguage: AllTextsProps =
      AllTexts[allSiteProps.siteProps!.language];
    if (!!selectedTextsWithLanguage) {
      if (!!selectedTextsWithLanguage[selection]) {
        texts = selectedTextsWithLanguage[selection];
      }
    }
    return <Component {...(props as P)} texts={texts} />;
  };
