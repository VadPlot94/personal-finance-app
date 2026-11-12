import { vi } from "vitest";

export interface IMatchMediaControl {
  setMatches: (matches: boolean) => void;
  mediaQueryList: MediaQueryList;
  listeners: Set<(event: MediaQueryListEvent) => void>;
}

export function installMatchMediaMock(
  initialMatches = true,
): IMatchMediaControl {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: "",
    onchange: null,
    addEventListener: vi.fn(
      (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
    ),
    removeEventListener: vi.fn(
      (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
    ),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(() => mediaQueryList),
  });

  return {
    mediaQueryList,
    listeners,
    setMatches: (nextMatches: boolean) => {
      matches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;
      listeners.forEach((listener) => {
        listener(event);
      });
    },
  };
}
