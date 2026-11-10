import { useCallback, useEffect, useRef, useState } from "react";

export function useFlash(label: string): [string, (text: string) => void] {
  const [text, setText] = useState(label);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const flash = useCallback(
    (next: string) => {
      setText(next);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setText(label), 1400);
    },
    [label]
  );
  return [text, flash];
}
