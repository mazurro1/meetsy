import React, {useState, useEffect} from "react";
import ReactTooltip from "react-tooltip";
import {NextPage} from "next";
import {Paragraph} from "@ui";
import shortid from "shortid";
import styled from "styled-components";

const LineHeightReset = styled.div<{
  display: string;
  fullWidth: boolean;
}>`
  display: ${(props) => props.display};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  #content-tooltip {
    line-height: 0;
  }
`;

interface TooltipProps {
  text: string | object;
  effect?: "float" | "solid";
  handleAfterShow?: () => void;
  handleAfterHide?: () => void;
  type?: "dark" | "success" | "warning" | "error" | "info" | "light";
  place?: "top" | "right" | "bottom" | "left";
  scrollHide?: boolean;
  enable?: boolean;
  display?: "inline" | "block" | "inline-block";
  fullWidth?: boolean;
}

const Tooltip: NextPage<TooltipProps> = ({
  text = "",
  effect = "float",
  handleAfterShow = () => {},
  handleAfterHide = () => {},
  type = "dark",
  place = "top",
  scrollHide = true,
  children,
  enable = true,
  display = "inline-block",
  fullWidth = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mountedId, setMountedId] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setMountedId(`${shortid.generate()}-${shortid.generate()}`);
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [text, isMounted]);

  const contentReactTooltip =
    isMounted && enable ? (
      <ReactTooltip
        id={mountedId}
        effect={effect}
        afterShow={handleAfterShow}
        afterHide={handleAfterHide}
        type={type}
        place={place}
        scrollHide={scrollHide}
        multiline
      >
        <Paragraph
          marginTop={0}
          marginBottom={0}
          color="WHITE_ONLY"
          fontSize="SMALL"
        >
          {text}
        </Paragraph>
      </ReactTooltip>
    ) : (
      enable && (
        <Paragraph
          marginTop={0}
          marginBottom={0}
          color="WHITE_ONLY"
          fontSize="SMALL"
        >
          {text}
        </Paragraph>
      )
    );

  return (
    <>
      {isMounted && contentReactTooltip}
      <LineHeightReset display={display} fullWidth={fullWidth}>
        <div data-tip data-for={mountedId} id="content-tooltip">
          {children}
        </div>
      </LineHeightReset>
    </>
  );
};
export default Tooltip;
