import { useEffect, useRef, useState } from "react";

export function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        return;
      }
      setDisplayed((prev) => prev + text[indexRef.current]);
      indexRef.current++;
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return displayed;
}
