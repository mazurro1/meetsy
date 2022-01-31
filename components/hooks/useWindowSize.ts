import { useState, useEffect, useCallback } from "react";

export interface UseWindowSizeProps {
  height: number | null;
  width: number | null;
}

const UseWindowSize = (): UseWindowSizeProps => {
  const isClient: boolean = typeof window === "object";
  const getSize = useCallback(() => {
    return {
      width: isClient ? window.innerWidth : null,
      height: isClient ? window.innerHeight : null,
    };
  }, [isClient]);

  const [windowSize, setWindowSize] = useState<UseWindowSizeProps>(getSize);

  const handleResize = useCallback(() => {
    setWindowSize(getSize());
  }, [getSize]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, handleResize]);
  return windowSize;
};
export default UseWindowSize;
