import { useState, useEffect, useCallback } from "react";

export type ChecklistStorageScope = string;

interface PersistKeys {
  scope: ChecklistStorageScope;
  entityId: string;
  language: string;
}

function getStorageKey({ scope, entityId, language }: PersistKeys): string {
  return `${scope}:${entityId}:${language}`;
}

function loadPersistedState(keys: PersistKeys): Record<string, boolean> {
  try {
    const key = getStorageKey(keys);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, boolean>;
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

function savePersistedState(keys: PersistKeys, state: Record<string, boolean>) {
  try {
    localStorage.setItem(getStorageKey(keys), JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

export interface UsePersistentStepsResult {
  checkedSteps: Record<string, boolean>;
  toggleStep: (stepId: string) => void;
  isChecked: (stepId: string) => boolean;
  completedCount: number;
  totalCount: number;
}

export interface UsePersistentStepsInput {
  entityId: string;
  language: string;
  stepIds: string[];
  /** Key segment for localStorage; default "activity" */
  storageScope?: ChecklistStorageScope;
}

/**
 * Hook for persistent checklist state per entity + language.
 * localStorage key: `${scope}:${entityId}:${language}`
 */
export const usePersistentSteps = ({
  entityId,
  language,
  stepIds,
  storageScope = "activity",
}: UsePersistentStepsInput): UsePersistentStepsResult => {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(
    () => loadPersistedState({ scope: storageScope, entityId, language }),
  );

  useEffect(() => {
    // Re-hydrate from localStorage when storage identity changes (external persistence).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional sync from localStorage on key change
    setCheckedSteps(
      loadPersistedState({ scope: storageScope, entityId, language }),
    );
  }, [storageScope, entityId, language]);

  useEffect(() => {
    savePersistedState(
      { scope: storageScope, entityId, language },
      checkedSteps,
    );
  }, [storageScope, entityId, language, checkedSteps]);

  const toggleStep = useCallback((stepId: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  }, []);

  const isChecked = useCallback(
    (stepId: string) => checkedSteps[stepId] === true,
    [checkedSteps],
  );

  const completedCount = stepIds.filter((id) => checkedSteps[id]).length;
  const totalCount = stepIds.length;

  return {
    checkedSteps,
    toggleStep,
    isChecked,
    completedCount,
    totalCount,
  };
};
