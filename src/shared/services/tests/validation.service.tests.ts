import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/shared/lib/test-utils/logger.service.mock";
import {
  AuthMode,
  Theme,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import validationService from "@/shared/services/validation.service";

describe("ValidationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateSignInSchema", () => {
    it("accepts valid credentials", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      // Arrange
      const formData = {
        email: "not-an-email",
        password: "secret",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateRegisterSchema", () => {
    it("accepts valid registration data", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret1",
        name: "Vad",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects short password", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "123",
        name: "Vad",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret1",
        name: "",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateAuthSchema", () => {
    it("validates sign-in mode without requiring a name", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret",
      };

      // Act
      const result = validationService.validateAuthSchema(
        formData,
        AuthMode.SignIn,
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it("requires a name for register mode", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret1",
      };

      // Act
      const result = validationService.validateAuthSchema(
        formData,
        AuthMode.Register,
      );

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateCreatePotSchema", () => {
    it("accepts a valid pot form", () => {
      // Arrange
      const formData = {
        id: "pot-1",
        theme: Theme.Green,
        potName: "Vacation",
        target: "500",
      };

      // Act
      const result = validationService.validateCreatePotSchema(
        formData,
        [],
        undefined,
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects a duplicate pot name", () => {
      // Arrange
      const formData = {
        id: "pot-1",
        theme: Theme.Green,
        potName: "Vacation",
        target: "500",
      };

      // Act
      const result = validationService.validateCreatePotSchema(
        formData,
        ["Vacation"],
        undefined,
      );

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects a target below the current pot total", () => {
      // Arrange
      const formData = {
        id: "pot-1",
        theme: Theme.Green,
        potName: "Vacation",
        target: "50",
      };

      // Act
      const result = validationService.validateCreatePotSchema(
        formData,
        [],
        100,
      );

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateTotal", () => {
    it("accepts an amount within target and balance", () => {
      // Arrange & Act
      const result = validationService.validateTotal("40", 100, 20, 200);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects an amount that exceeds available balance", () => {
      // Arrange & Act
      const result = validationService.validateTotal("80", 200, 20, 50);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects an amount that exceeds the pot target", () => {
      // Arrange & Act
      const result = validationService.validateTotal("90", 100, 20, 500);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateAddBudgetSchema", () => {
    it("accepts a valid maximum", () => {
      // Arrange
      const formData = {
        id: "budget-1",
        budgetCategory: TransactionUICategory.Entertainment,
        maximum: "200",
        theme: Theme.Green,
      };

      // Act
      const result = validationService.validateAddBudgetSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects an invalid cash maximum", () => {
      // Arrange
      const formData = {
        id: "budget-1",
        budgetCategory: TransactionUICategory.Entertainment,
        maximum: "0",
        theme: Theme.Green,
      };

      // Act
      const result = validationService.validateAddBudgetSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateCreateTransactionSchema", () => {
    it("accepts a valid expense transaction", () => {
      // Arrange
      const formData = {
        transactionType: TransactionType.Expense,
        category: TransactionUICategory.Bills,
        recipientOrSender: "Netflix",
        amount: "25",
        date: "2024-06-01",
      };

      // Act
      const result =
        validationService.validateCreateTransactionSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects an empty recipient name", () => {
      // Arrange
      const formData = {
        transactionType: TransactionType.Expense,
        category: TransactionUICategory.Bills,
        recipientOrSender: "",
        amount: "25",
        date: "2024-06-01",
      };

      // Act
      const result =
        validationService.validateCreateTransactionSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects a future date", () => {
      // Arrange
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const formData = {
        transactionType: TransactionType.Expense,
        category: TransactionUICategory.Bills,
        recipientOrSender: "Netflix",
        amount: "25",
        date: future.toISOString(),
      };

      // Act
      const result =
        validationService.validateCreateTransactionSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects a date older than 15 years", () => {
      // Arrange
      const formData = {
        transactionType: TransactionType.Expense,
        category: TransactionUICategory.Bills,
        recipientOrSender: "Netflix",
        amount: "25",
        date: "2000-01-01",
      };

      // Act
      const result =
        validationService.validateCreateTransactionSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("createErrorsWithPath", () => {
    it("maps the first issue per field path", () => {
      // Arrange
      const failed = validationService.validateSignInSchema({
        email: "bad",
        password: "",
      });
      if (failed.success) {
        throw new Error("expected validation failure");
      }

      // Act
      const errors = validationService.createErrorsWithPath(failed);

      // Assert
      expect(errors.email).toBe("i18n.Validation.InvalidEmail");
      expect(errors.password).toBe("i18n.Validation.PasswordRequired");
    });
  });

  describe("createCustomZodIssueResult", () => {
    it("builds a failed parse result for a custom field message", () => {
      // Arrange & Act
      const result = validationService.createCustomZodIssueResult(
        "amount",
        "i18n.Validation.InvalidCash",
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.issues[0]?.path).toEqual(["amount"]);
      expect(result.error.issues[0]?.message).toBe(
        "i18n.Validation.InvalidCash",
      );
    });
  });
});
