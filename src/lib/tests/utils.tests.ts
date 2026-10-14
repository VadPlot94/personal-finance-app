import { describe, expect, it } from "vitest";
import { removeUndefinedFields } from "@/lib/utils";

describe("utils", () => {
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
