import { useState, useEffect } from "react";

export interface UseWindowSizeProps {
  height?: number;
  width?: number;
}

const UseWindowSize = (): UseWindowSizeProps => {
  const isClient: boolean = typeof window === "object";
  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };
  const [windowSize, setWindowSize] = useState<UseWindowSizeProps>(getSize);

  const handleResize = () => {
    setWindowSize(getSize());
  };

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);
  return windowSize;
};
export default UseWindowSize;
