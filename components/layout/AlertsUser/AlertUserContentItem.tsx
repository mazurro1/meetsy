import {NextPage} from "next";
import styled from "styled-components";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import type {AlertProps} from "@/models/Alert/alert.model";

interface AlertUserContentItemProps {
  item: AlertProps;
}

const AlertUserStyle = styled.div`
  width: 100%;
  padding: 5px 10px;
  background-color: gray;
  margin: 5px 0px;
  border-radius: 5px;
`;

const AlertUserContentItem: NextPage<
  ISiteProps & ITranslatesProps & AlertUserContentItemProps
> = ({texts, dispatch, user, siteProps, isMobile, item}) => {
  return <AlertUserStyle>{item?.type}</AlertUserStyle>;
};

export default withTranslates(withSiteProps(AlertUserContentItem), "LoginPage");
