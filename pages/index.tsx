import { NextPage } from "next";
import { PageSegment, LinkEffect } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
  return (
    <div>
      <PageSegment id="home_page">xxxxxxxx</PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
