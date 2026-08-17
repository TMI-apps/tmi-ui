import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(
    _callback?: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.ResizeObserver = MockResizeObserver;
globalThis.IntersectionObserver = MockIntersectionObserver;

afterEach(() => {
  cleanup();
});
