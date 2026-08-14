import {
  closestCorners,
  DndContext as DndKitContext,
  DragOverlay,
  type CollisionDetection,
  type DragCancelEvent,
  type DragEndEvent,
  type MeasuringConfiguration,
  type SensorDescriptor,
  type SensorOptions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  useRef,
  useState,
  type ComponentProps,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from "react";
import type { DatabaseViewerRowReorderPointerSample } from "../../shared-types/databaseViewerRowReorder.types.js";

type DragOverlayDropAnimation = ComponentProps<
  typeof DragOverlay
>["dropAnimation"];

export interface TmiRowReorderDndProviderProps {
  children: ReactNode;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
  /** Clears transient drag listeners (paired with optional pointer sample tracking). */
  onDragCancel?: (event: DragCancelEvent) => void;
  /** For vertical sortable lists; cards/home grid uses closestCorners. */
  collisionDetection?: CollisionDetection;
  /**
   * Optional tuning (e.g. **`MeasuringFrequency.Optimized`**) for virtualization-heavy surfaces.
   */
  measuring?: MeasuringConfiguration;
  /**
   * Fixed-size drag preview (portal). When set, **`DragOverlay`** is mounted.
   *
   * **`dragOverlayDropAnimation`:** pass **`null`** when the mirror is a virtualized table row and
   * **`@dnd-kit`’s** default snap reads as a rectangular flash; omit the prop for built-in config elsewhere.
   */
  renderDragOverlay?: (activeId: UniqueIdentifier) => ReactNode;
  /** @defaultValue omitted — `@dnd-kit/core` default drop animation on the overlay. */
  dragOverlayDropAnimation?: DragOverlayDropAnimation;
  /**
   * Optional: mutated during drag with last pointer client position + modifier keys (table row
   * bands / Alt+drag). `@dnd-kit` `DragMoveEvent.delta` is scroll-adjusted translation, not the
   * viewport pointer, and **Alt** may toggle mid-drag — a live `pointermove` stream remains the
   * reliable source. `pointerup`/`pointercancel` records the release position so `DragEnd` sees a
   * fresh sample when the last frame had no move.
   */
  dragPointerSampleRef?: MutableRefObject<DatabaseViewerRowReorderPointerSample | null>;
}

/**
 * Generic `@dnd-kit` shell for table row reorder and other sortable surfaces.
 * Home lesson grids use the app alias {@link LesmateriaalGridDndContext} (`closestCorners` default).
 */
export function TmiRowReorderDndProvider(
  props: TmiRowReorderDndProviderProps,
): ReactElement {
  const {
    children,
    sensors,
    onDragEnd,
    onDragCancel,
    renderDragOverlay,
    dragOverlayDropAnimation,
    collisionDetection = closestCorners,
    measuring,
    dragPointerSampleRef,
  } = props;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const pointerCleanupRef = useRef<(() => void) | null>(null);

  const attachDragPointerSampleTracking = (): void => {
    if (!dragPointerSampleRef) return;
    const writeSample = (e: PointerEvent): void => {
      dragPointerSampleRef.current = {
        x: e.clientX,
        y: e.clientY,
        altKey: e.altKey,
      };
    };
    window.addEventListener("pointermove", writeSample, { capture: true });
    window.addEventListener("pointerup", writeSample, { capture: true });
    window.addEventListener("pointercancel", writeSample, { capture: true });
    pointerCleanupRef.current = () => {
      window.removeEventListener("pointermove", writeSample, { capture: true });
      window.removeEventListener("pointerup", writeSample, { capture: true });
      window.removeEventListener("pointercancel", writeSample, {
        capture: true,
      });
    };
  };

  const detachDragPointerSampleTracking = (): void => {
    pointerCleanupRef.current?.();
    pointerCleanupRef.current = null;
    if (dragPointerSampleRef) {
      dragPointerSampleRef.current = null;
    }
  };

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={measuring}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        attachDragPointerSampleTracking();
      }}
      onDragCancel={(event) => {
        detachDragPointerSampleTracking();
        onDragCancel?.(event);
        setActiveId(null);
      }}
      onDragEnd={(event) => {
        onDragEnd(event);
        detachDragPointerSampleTracking();
        setActiveId(null);
      }}
    >
      {children}
      {renderDragOverlay ? (
        <DragOverlay
          adjustScale={false}
          {...(dragOverlayDropAnimation !== undefined
            ? { dropAnimation: dragOverlayDropAnimation }
            : {})}
        >
          {activeId !== null ? renderDragOverlay(activeId) : null}
        </DragOverlay>
      ) : null}
    </DndKitContext>
  );
}
