import "server-only";
import { Transaction } from "@prisma/client";

export type ICreateTransactionDTOInput = FormData;

export interface ICreateTransactionDTOOutput extends Pick<Transaction, "id"> {}
