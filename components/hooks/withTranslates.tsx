import React from "react";
// import { useSelector } from "react-redux"
// import * as AllTranslates from "@common/Translates/index"
// import { SitePropsInterface } from "@common/types"

// const withTranslates =
//   (Component: any, selection: string = "") =>
//   (props: any) => {
//     const siteProps: SitePropsInterface = useSelector(
//       (state: any) => state.siteProps
//     )
//     let texts: object = {}
//     let selectedTextsWithLanguage: any =
//       AllTranslates.Translates[siteProps.language]
//     if (!!selectedTextsWithLanguage) {
//       if (!!selectedTextsWithLanguage[selection]) {
//         texts = selectedTextsWithLanguage[selection]
//       }
//     }

//     return React.createElement(Component, { ...props, texts })
//   }
// export default withTranslates
