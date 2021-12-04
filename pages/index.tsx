import { NextPage } from "next";
import { PageSegment, ButtonIcon, Heading, Paragraph } from "@ui";
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
    <div>
      <Heading color="BLACK">hellow!</Heading>
      <div>
        <ButtonIcon iconName="MailIcon" onClick={handleClickBlind} id="xd">
          klik button blind
        </ButtonIcon>
      </div>
      <PageSegment id="home_page">
        <Paragraph spanColor="GREEN">
          xsada sdas dasd <span>span</span>
        </Paragraph>
        <div style={{ marginTop: "100px" }}>
          <ButtonIcon id="xd" iconName="MailIcon" onClick={handleClick}>
            klik button test
          </ButtonIcon>
        </div>
      </PageSegment>
    </div>
  );
};

export default withSiteProps(Home);
