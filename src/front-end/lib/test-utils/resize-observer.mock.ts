import { vi } from "vitest";

export interface IResizeObserverControl {
  trigger: (width: number, height?: number) => void;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

export function installResizeObserverMock(): IResizeObserverControl {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let callback: ResizeObserverCallback | null = null;

  class ResizeObserverMock {
    public constructor(cb: ResizeObserverCallback) {
      callback = cb;
    }

    public observe = observe;
    public unobserve = vi.fn();
    public disconnect = disconnect;
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });

  return {
    observe,
    disconnect,
    trigger: (width: number, height = 100) => {
      if (!callback) {
        return;
      }
      const entry = {
        contentRect: { width, height, top: 0, left: 0, bottom: height, right: width, x: 0, y: 0, toJSON: () => ({}) },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
        target: document.body,
      } as unknown as ResizeObserverEntry;
      callback([entry], {} as ResizeObserver);
    },
  };
}
