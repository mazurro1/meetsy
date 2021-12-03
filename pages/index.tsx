import type { NextPage } from "next";
import { PageSegment } from "@ui";
import { useSelector, RootStateOrAny } from "react-redux";
import { useDispatch } from "react-redux";
import { updateDarkMode } from "@/components/redux/site/actions";

const Home: NextPage = () => {
  const { siteProps } = useSelector((state: RootStateOrAny) => state.site);
  console.log(siteProps);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(updateDarkMode(!siteProps.dark));
  };
  return (
    <PageSegment id="home_page">
      hellow! <button onClick={handleClick}>click</button>
    </PageSegment>
  );
};

export default Home;
