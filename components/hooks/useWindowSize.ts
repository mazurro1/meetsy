import { useState, useEffect } from "react";

export interface UseWindowSizeProps {
  height?: number;
  width?: number;
}

const UseWindowSize = (): UseWindowSizeProps => {
  const isClient = typeof window === "object";
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }
  const [windowSize, setWindowSize] = useState<UseWindowSizeProps>(getSize);
  useEffect(() => {
    if (!isClient) {
      return;
    }
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);
  return windowSize;
};
export default UseWindowSize;
