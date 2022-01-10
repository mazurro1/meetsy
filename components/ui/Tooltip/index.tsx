import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { NextPage } from "next";
import { Paragraph } from "@ui";
import shortid from "shortid";

interface TooltipProps {
  text: string | object;
  effect?: "float" | "solid";
  handleAfterShow?: () => void;
  handleAfterHide?: () => void;
  type?: "dark" | "success" | "warning" | "error" | "info" | "light";
  place?: "top" | "right" | "bottom" | "left";
  scrollHide?: boolean;
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

  return (
    <>
      {isMounted && (
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
      )}
      <div data-tip data-for={mountedId}>
        {children}
      </div>
    </>
  );
};
export default Tooltip;
