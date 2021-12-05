import type { ISiteProps } from "@hooks";
import { useSelector, RootStateOrAny } from "react-redux";
import type { NextPage } from "next";
import { AllTexts } from "@constants";
import type { AllTextsProps } from "@constants";

export interface ITranslatesProps {
  texts: {
    [propName: string]: string;
  };
}

export const withTranslates =
  <P extends object>(Component: NextPage<P>, selection: string): NextPage<P> =>
  (props: P) => {
    const allSiteProps: ISiteProps = useSelector(
      (state: RootStateOrAny) => state.site
    );
    let texts: ITranslatesProps | {} = {};
    let selectedTextsWithLanguage: AllTextsProps =
      AllTexts[allSiteProps.siteProps.language];
    if (!!selectedTextsWithLanguage) {
      if (!!selectedTextsWithLanguage[selection]) {
        texts = selectedTextsWithLanguage[selection];
      }
    }
    return <Component {...(props as P)} texts={texts} />;
  };
