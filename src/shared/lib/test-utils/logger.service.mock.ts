import { vi } from "vitest";

vi.mock("@/shared/services/logger.service", () => ({
  default: {
    logError: vi.fn(),
    logInfo: vi.fn(),
    logWarn: vi.fn(),
  },
}));
