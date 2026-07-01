import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./server";

type CustomGlobal = typeof globalThis & {
  __i18next_supportNoticeShown?: boolean;
};
if (typeof globalThis !== "undefined") {
  (globalThis as unknown as CustomGlobal).__i18next_supportNoticeShown = true;
}

/**
 * jsdom polyfills for browser APIs not available in the test environment.
 */

// IntersectionObserver — used by react-intersection-observer / lazy loading
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// ResizeObserver — used by Radix/shadcn popovers and embla-carousel
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// scrollTo — jsdom doesn't implement window.scrollTo
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

// Patch global fetch to support relative URLs in Node.js (jsdom)
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  let url = input;
  if (typeof input === "string" && input.startsWith("/")) {
    url = `http://localhost${input}`;
  } else if (input instanceof URL && input.pathname.startsWith("/")) {
    // URL object is already absolute, but just in case
  }
  return originalFetch(url, init);
};

/**
 * Mock @tanstack/react-start so server functions call their handlers directly.
 * Without this, createServerFn tries to make an RPC call to a TanStack Start
 * server that doesn't exist in jsdom, causing every API call to return undefined.
 */
vi.mock("@tanstack/react-start", () => {
  const createServerFn = (_opts?: Record<string, unknown>) => {
    let validator: ((d: unknown) => unknown) | undefined;

    const builder = {
      inputValidator(fn: (d: unknown) => unknown) {
        validator = fn;
        return builder;
      },
      handler(handlerFn: (ctx: { data: unknown }) => unknown) {
        const serverFn = async (input?: unknown) => {
          // createServerFn wraps input as { data: validatedInput }
          const rawData =
            input && typeof input === "object" && "data" in input
              ? (input as Record<string, unknown>).data
              : input;
          const validated = validator ? validator(rawData) : rawData;
          return handlerFn({ data: validated });
        };
        return serverFn;
      },
    };

    return builder;
  };

  const createIsomorphicFn = () => {
    let clientFn: ((...args: unknown[]) => unknown) | undefined;

    const isomorphicFn = (...args: unknown[]) => {
      if (clientFn) return clientFn(...args);
      return undefined;
    };

    isomorphicFn.client = (fn: (...args: unknown[]) => unknown) => {
      clientFn = fn;
      return isomorphicFn;
    };

    isomorphicFn.server = (_fn: (...args: unknown[]) => unknown) => {
      // In jsdom tests, always use the client function
      return isomorphicFn;
    };

    return isomorphicFn;
  };

  return {
    createServerFn,
    createIsomorphicFn,
  };
});

// Mock @tanstack/react-start/server — not available in jsdom
vi.mock("@tanstack/react-start/server", () => ({
  getRequest: () => undefined,
}));

// Mock useLazyInteraction to always return true in tests
vi.mock("@repo/hooks/useLazyInteraction", () => ({
  useLazyInteraction: () => true,
}));

// Mock LazySection to render children immediately to avoid IntersectionObserver issues
vi.mock("@repo/ui/ui/lazy-section", () => ({
  LazySection: ({ children }: { children?: React.ReactNode }) => children,
}));

// Mock window.matchMedia for embla-carousel and other components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Combobox from @repo/ui to prevent @base-ui/react from hanging jsdom
import React from "react";

vi.mock("@repo/ui/ui/combobox", () => ({
  Combobox: (props: Record<string, unknown> & { children?: React.ReactNode }) =>
    React.createElement("div", null, props.children),
  ComboboxTrigger: (
    props: Record<string, unknown> & { children?: React.ReactNode },
  ) => React.createElement("button", { type: "button" }, props.children),
  ComboboxValue: (
    props: Record<string, unknown> & { children?: React.ReactNode },
  ) => React.createElement("span", null, props.children),
  ComboboxContent: (
    props: Record<string, unknown> & { children?: React.ReactNode },
  ) => React.createElement("div", null, props.children),
  ComboboxInput: (props: React.InputHTMLAttributes<HTMLInputElement>) =>
    React.createElement("input", props),
  ComboboxItem: (
    props: Record<string, unknown> & { children?: React.ReactNode },
  ) => React.createElement("div", null, props.children),
}));

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
