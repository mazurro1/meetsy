import {NextPage} from "next";
import {CSSTransition} from "react-transition-group";

interface HiddenContentProps {
  enable: boolean;
  timeout?: number;
  effect?: "popup" | "opacity";
}

const HiddenContent: NextPage<HiddenContentProps> = ({
  enable = false,
  children,
  timeout = 400,
  effect = "popup",
}) => {
  return (
    <CSSTransition
      in={enable}
      timeout={timeout}
      classNames={effect}
      unmountOnExit
    >
      <div>{children}</div>
    </CSSTransition>
  );
};

export default HiddenContent;
