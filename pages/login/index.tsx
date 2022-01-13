import { NextPage } from "next";
import { PageSegment } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
}) => {
  return (
    <div>
      <PageSegment id="login_page">login</PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "LoginPage");
