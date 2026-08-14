import { createContext, useContext, type ReactNode } from "react";

export type DatabaseTableDetailWorkspaceLayoutValue = {
  tableMaxHeightPx: number | string;
  fillViewport: boolean;
};

export const DatabaseTableDetailWorkspaceLayoutContext =
  createContext<DatabaseTableDetailWorkspaceLayoutValue | null>(null);

export function useDatabaseTableDetailWorkspaceLayout(): DatabaseTableDetailWorkspaceLayoutValue | null {
  return useContext(DatabaseTableDetailWorkspaceLayoutContext);
}

export function DatabaseTableDetailWorkspaceLayoutProvider({
  value,
  children,
}: {
  value: DatabaseTableDetailWorkspaceLayoutValue;
  children: ReactNode;
}) {
  return (
    <DatabaseTableDetailWorkspaceLayoutContext.Provider value={value}>
      {children}
    </DatabaseTableDetailWorkspaceLayoutContext.Provider>
  );
}
