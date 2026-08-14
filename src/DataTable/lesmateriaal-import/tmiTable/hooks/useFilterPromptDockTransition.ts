import { useLayoutEffect, useRef, useState } from "react";

/** Tracks idle→active transition for table enter animation (one-shot per exit from idle). */
export function useFilterPromptDockTransition(filterPromptActive: boolean) {
  const wasIdleRef = useRef(filterPromptActive);
  const [tableEnterToken, setTableEnterToken] = useState(0);

  useLayoutEffect(() => {
    if (wasIdleRef.current && !filterPromptActive) {
      setTableEnterToken((token) => token + 1);
    }
    wasIdleRef.current = filterPromptActive;
  }, [filterPromptActive]);

  const playTableEnter = tableEnterToken > 0 && !filterPromptActive;

  return { tableEnterToken, playTableEnter };
}
