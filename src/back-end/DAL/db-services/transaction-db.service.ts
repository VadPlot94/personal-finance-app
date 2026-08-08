import validationService from "@/shared/services/validation.service";
import { Transaction } from "@prisma/client";
import { transactionRepository } from "../repositories/transaction.repository";
import {
  CustomError,
  throwValidationError,
} from "@/back-end/server-actions/common";
import {
  mapCreateDBTransactionToOutput,
  mapCreateTransactionInputToDBTransaction,
  mapGetTransactionsInputToDBTransactionsParams,
} from "@/back-end/mappers/transaction-mapper";
import { ICreateTransactionDTOInput } from "@/back-end/dto-models/transaction-dto.model";
import { IGetTransactionsParams } from "@/back-end/server-actions/types";
import { ITransactionDataResponse } from "../repositories/types";
import constants, {
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";

export async function getTransactions(
  data: Partial<IGetTransactionsParams> | undefined,
  userId: string,
): Promise<ITransactionDataResponse> {
  return await transactionRepository.getTransactions({
    ...mapGetTransactionsInputToDBTransactionsParams(data),
    userId,
  });
}

export async function createTransaction(
  formData: ICreateTransactionDTOInput,
  userId: string,
): Promise<Transaction> {
  validateCreateTransactionFormData(formData);

  const transactionModel =
    mapCreateTransactionInputToDBTransaction(formData) as Omit<
      Transaction,
      "id"
    >;

  const response = await transactionRepository.createTransaction({
    ...transactionModel,
    userId,
  });

  return response;
}

function validateCreateTransactionFormData(
  formData: ICreateTransactionDTOInput,
): void {
  const validationData = {
    transactionType: formData.get("transactionType") as
      | TransactionType
      | undefined,
    category: formData.get("category") as TransactionUICategory | undefined,
    recipientOrSender: formData.get("recipientOrSender")?.toString() || "",
    amount: formData.get("amount")?.toString() || "",
    date: formData.get("date")?.toString() || "",
  };

  const validationResult = validationService.validateCreateTransactionSchema(
    validationData,
  );

  throwValidationError(validationResult);
}

