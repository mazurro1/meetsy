import type { NextPage } from "next";
import { PageSegment, ButtonIcon } from "@ui";
import { useDispatch } from "react-redux";
import { updateDarkMode, updateBlindMode } from "@/redux/site/actions";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";

const Home: NextPage<ISiteProps> = ({ siteProps }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(updateDarkMode(!siteProps.dark));
  };
  const handleClickBlind = () => {
    dispatch(updateBlindMode(!siteProps.blind));
  };
  return (
    <PageSegment id="home_page">
      hellow!
      <div>
        <ButtonIcon
          id="xd"
          title="klik button blind"
          iconName="MailIcon"
          onClick={handleClickBlind}
        />
      </div>
      <div style={{ marginTop: "100px" }}>
        <ButtonIcon
          id="xd"
          title="klik button test"
          iconName="MailIcon"
          onClick={handleClick}
        />
      </div>
    </PageSegment>
  );
};

export default withSiteProps(Home);
