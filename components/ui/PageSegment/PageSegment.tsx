import type { PageSegmentProps } from "./PageSegment.model";
import { SectionStyle } from "./PageSegment.style";
import type { NextPage } from "next";
import PropTypes from "prop-types";

const PageSegment: NextPage<PageSegmentProps> = ({
  id = "",
  children,
  marginTop = 0,
  marginBottom = 0,
}) => {
  return (
    <SectionStyle id={id} marginTop={marginTop} marginBottom={marginBottom}>
      {children}
    </SectionStyle>
  );
};

PageSegment.propTypes = {
  id: PropTypes.string.isRequired,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
};

export default PageSegment;
