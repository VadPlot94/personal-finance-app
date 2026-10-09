import "server-only";

export function balanceTag(userId: string): string {
  return `balance:${userId}`;
}

export function potsTag(userId: string): string {
  return `pots:${userId}`;
}

export function budgetsTag(userId: string): string {
  return `budgets:${userId}`;
}

export function transactionsTag(userId: string): string {
  return `transactions:${userId}`;
}
