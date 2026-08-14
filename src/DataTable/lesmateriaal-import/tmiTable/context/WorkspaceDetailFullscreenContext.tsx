import { createContext, useContext, useMemo, type ReactNode } from "react";

export type WorkspaceDetailFullscreenValue = {
  /** Primary column is hidden; detail uses full workspace width. */
  active: boolean;
  toggle: () => void;
  /** `lg+` inline detail — toggle is meaningful (hidden in drawer mode). */
  available: boolean;
};

const WorkspaceDetailFullscreenContext =
  createContext<WorkspaceDetailFullscreenValue | null>(null);

export function WorkspaceDetailFullscreenProvider({
  value,
  children,
}: {
  value: WorkspaceDetailFullscreenValue;
  children: ReactNode;
}) {
  const memo = useMemo(() => value, [value]);
  return (
    <WorkspaceDetailFullscreenContext.Provider value={memo}>
      {children}
    </WorkspaceDetailFullscreenContext.Provider>
  );
}

/** Returns null outside {@link TMITableWorkspace} or when toggle is unavailable. */
export function useWorkspaceDetailFullscreen(): WorkspaceDetailFullscreenValue | null {
  return useContext(WorkspaceDetailFullscreenContext);
}
