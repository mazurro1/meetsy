import type { PageSegmentProps } from "./PageSegment.model";
import { SectionStyle } from "./PageSegment.style";
import type { NextPage } from "next";

const PageSegment: NextPage<PageSegmentProps> = ({
  id = "",
  children,
  marginTop = 0,
  marginBottom = 0,
  paddingBottom = 0,
  paddingTop = 0,
  maxWidth = 1200,
}) => {
  return (
    <SectionStyle
      id={id}
      marginTop={marginTop}
      marginBottom={marginBottom}
      maxWidth={maxWidth}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
    >
      {children}
    </SectionStyle>
  );
};

export default PageSegment;
