import "server-only";
import type { Transaction } from "@prisma/client";

export type ICreateTransactionDTOInput = FormData;

export interface ICreateTransactionDTOOutput extends Pick<Transaction, "id"> {}
