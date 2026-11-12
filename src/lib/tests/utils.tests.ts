import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/shared/services/translation.service", () => ({
  default: {
    translate: vi.fn(
      (
        _t: unknown,
        input: string | Record<string, string> | null | undefined,
        fallback?: string,
      ) => {
        if (input && typeof input === "object") {
          return input;
        }
        return input || fallback || "";
      },
    ),
  },
}));

import { toast } from "sonner";
import {
  cn,
  handleDialogFormActionResult,
  orEmptyStr,
  removeUndefinedFields,
} from "@/lib/utils";

describe("utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("cn", () => {
    it("merges class names", () => {
      // Arrange & Act
      const result = cn("p-2", false && "hidden", "text-sm");

      // Assert
      expect(result).toContain("p-2");
      expect(result).toContain("text-sm");
    });
  });

  describe("handleDialogFormActionResult", () => {
    it("does nothing when form state is null", () => {
      // Arrange
      const onOpenChange = vi.fn();

      // Act
      handleDialogFormActionResult(null, false, onOpenChange);

      // Assert
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("shows a success toast and closes the dialog", () => {
      // Arrange
      const onOpenChange = vi.fn();

      // Act
      handleDialogFormActionResult(
        { success: true, message: "i18n.Common.Ok" },
        false,
        onOpenChange,
      );

      // Assert
      expect(toast.success).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("sets translated zod errors when present", () => {
      // Arrange
      const onOpenChange = vi.fn();
      const setFormErrors = vi.fn();

      // Act
      handleDialogFormActionResult(
        {
          success: false,
          zodErrors: { amount: "i18n.Validation.InvalidCash" },
        },
        false,
        onOpenChange,
        setFormErrors,
      );

      // Assert
      expect(setFormErrors).toHaveBeenCalledWith({
        amount: "i18n.Validation.InvalidCash",
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("shows an error toast for non-zod failures", () => {
      // Arrange
      const onOpenChange = vi.fn();

      // Act
      handleDialogFormActionResult(
        { success: false, error: "boom" },
        false,
        onOpenChange,
      );

      // Assert
      expect(toast.error).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("orEmptyStr", () => {
    it("returns the value when present", () => {
      // Arrange & Act
      const result = orEmptyStr("hello");

      // Assert
      expect(result).toBe("hello");
    });

    it("returns an empty string for null", () => {
      // Arrange & Act
      const result = orEmptyStr(null);

      // Assert
      expect(result).toBe("");
    });

    it("returns an empty string for undefined", () => {
      // Arrange & Act
      const result = orEmptyStr(undefined);

      // Assert
      expect(result).toBe("");
    });
  });

  describe("removeUndefinedFields", () => {
    it("drops null keys", () => {
      // Arrange
      const input = { a: 1, b: null };

      // Act
      const result = removeUndefinedFields(input);

      // Assert
      expect(result).toEqual({ a: 1 });
    });

    it("drops undefined keys", () => {
      // Arrange
      const input = { a: 1, c: undefined };

      // Act
      const result = removeUndefinedFields(input);

      // Assert
      expect(result).toEqual({ a: 1 });
    });

    it("keeps zero", () => {
      // Arrange
      const input = { zero: 0 };

      // Act
      const result = removeUndefinedFields(input);

      // Assert
      expect(result).toEqual({ zero: 0 });
    });

    it("keeps empty string", () => {
      // Arrange
      const input = { empty: "" };

      // Act
      const result = removeUndefinedFields(input);

      // Assert
      expect(result).toEqual({ empty: "" });
    });

    it("keeps false", () => {
      // Arrange
      const input = { flag: false };

      // Act
      const result = removeUndefinedFields(input);

      // Assert
      expect(result).toEqual({ flag: false });
    });
  });
});
