import {NextPage} from "next";
import styled from "styled-components";

const PositionHookScroll = styled.div<{
  paddingX: number;
  paddingY: number;
}>`
  height: auto;
  width: 100%;
  overflow-y: auto;
  padding: ${(props) => `${props.paddingX}px ${props.paddingY}px`};
`;

interface ScrollBottomActionProps {
  handleScrollAction: () => void;
  paddingX?: number;
  paddingY?: number;
  lengthItems: number;
  ref?: React.RefObject<HTMLDivElement>;
}

const ScrollBottomAction: NextPage<ScrollBottomActionProps> = ({
  handleScrollAction = () => {},
  children,
  paddingX = 0,
  paddingY = 0,
  lengthItems = 0,
  ref = null,
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && lengthItems % 10 === 0) {
      handleScrollAction();
    }
  };

  return (
    <PositionHookScroll
      onScroll={handleScroll}
      paddingX={paddingX}
      paddingY={paddingY}
      ref={ref}
    >
      {children}
    </PositionHookScroll>
  );
};

export default ScrollBottomAction;
