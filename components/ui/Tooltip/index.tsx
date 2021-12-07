import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { NextPage } from "next";
import { Paragraph } from "@ui";

interface TooltipProps {
  id: string;
  text: string;
  effect?: "float" | "solid";
  handleAfterShow?: () => void;
  handleAfterHide?: () => void;
  type?: "dark" | "success" | "warning" | "error" | "info" | "light";
  place?: "top" | "right" | "bottom" | "left";
  scrollHide?: boolean;
}

const Tooltip: NextPage<TooltipProps> = ({
  id = "",
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [text, isMounted]);

  return (
    <>
      {isMounted && (
        <ReactTooltip
          id={id}
          effect={effect}
          afterShow={handleAfterShow}
          afterHide={handleAfterHide}
          type={type}
          place={place}
          scrollHide={scrollHide}
          multiline
        >
          <Paragraph marginTop={0} marginBottom={0} color="WHITE">
            {text}
          </Paragraph>
        </ReactTooltip>
      )}
      <div data-tip data-for={id}>
        {children}
      </div>
    </>
  );
};
export default Tooltip;
