import { NextPage } from "next";
import { PageSegment } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
  return (
    <div>
      <PageSegment id="home_page">xddd</PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
