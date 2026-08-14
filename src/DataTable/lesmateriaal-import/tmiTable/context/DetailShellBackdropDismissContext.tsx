import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  type MutableRefObject,
  type ReactNode,
} from "react";

type DetailShellBackdropDismissRegistrarValue = {
  handlerRef: MutableRefObject<(() => void) | null>;
};

const DetailShellBackdropDismissRegistrarContext =
  createContext<DetailShellBackdropDismissRegistrarValue | null>(null);

/**
 * Wraps `TMITableWorkspace` detail content so active panes can register the handler
 * used for Drawer backdrop / Escape (matches hero close + unsaved flows).
 */
export function DetailShellBackdropDismissRegistrar(props: {
  handlerRef: MutableRefObject<(() => void) | null>;
  children: ReactNode;
}) {
  const { handlerRef, children } = props;
  const value = useMemo(() => ({ handlerRef }), [handlerRef]);
  return (
    <DetailShellBackdropDismissRegistrarContext.Provider value={value}>
      {children}
    </DetailShellBackdropDismissRegistrarContext.Provider>
  );
}

/**
 * Registers the dismiss handler while mounted (detail pane close / confirm flow).
 */
export function useRegisterDetailShellBackdropDismiss(
  handler: () => void,
): void {
  const ctx = useContext(DetailShellBackdropDismissRegistrarContext);
  useLayoutEffect(() => {
    if (!ctx) return;
    ctx.handlerRef.current = handler;
    return () => {
      ctx.handlerRef.current = null;
    };
  }, [ctx, handler]);
}
