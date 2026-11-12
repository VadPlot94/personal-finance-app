import "server-only";
import type { Transaction } from "@prisma/client";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";
import recurringScheduleService from "@/shared/services/recurring-schedule.service";

/**
 * Service that automatically posts recurring expenses when they become due.
 *
 * Recurring bills are stored as normal `Transaction` rows with `recurring: true`
 * and a negative `amount`. There is no background cron job — callers must invoke
 * this service before reading balances or the list of recurring transactions.
 */
class RecurringDbService {
  /**
   * In-process lock that prevents the same user from posting the same bill twice
   * when multiple requests run in parallel (for example Overview calling
   * getBalance and getAllRecurring at the same time).
   *
   * Note: this only works inside a single Node process; it does not protect
   * against concurrent requests across multiple server instances.
   */
  private readonly inflightByUserId = new Map<string, Promise<number>>();

  /**
   * Posts any recurring expenses that are due in the current calendar month,
   * then recalculates the user's balance if any new rows were created.
   *
   * A bill is considered due when:
   * - today's date is on or after the due day for this month, and
   * - no transaction with the same name already exists for the current year/month.
   *
   * Past months are never back-filled (this avoids accidentally making the
   * Current balance negative with old seed data).
   *
   * @returns The number of new transaction rows that were created.
   */
  public async materializeDueBills(
    userId: string,
    today: Date = new Date(),
  ): Promise<number> {
    const inflight = this.inflightByUserId.get(userId);
    if (inflight) {
      return inflight;
    }

    const pending = this.materializeDueBillsForUser(userId, today).finally(
      () => {
        this.inflightByUserId.delete(userId);
      },
    );
    this.inflightByUserId.set(userId, pending);
    return pending;
  }

  /**
   * Internal implementation of {@link materializeDueBills} without the lock.
   *
   * Steps:
   * 1. Load every recurring expense for the user (both templates and already-posted rows).
   * 2. Derive one template per unique name (the most recent row).
   * 3. Decide which templates are due this month and have not been posted yet.
   * 4. Insert the missing transactions.
   * 5. Recalculate Current / Income / Expenses balances if anything was inserted.
   */
  private async materializeDueBillsForUser(
    userId: string,
    today: Date,
  ): Promise<number> {
    const recurringExpenses =
      await transactionRepository.getRecurringExpenses(userId);
    const templates = this.getTemplates(recurringExpenses);
    const year = today.getFullYear();
    const month = today.getMonth();

    const billsToPost = templates.filter((template) => {
      const dueDate = recurringScheduleService.getDueDateInMonth(
        year,
        month,
        new Date(template.date).getDate(),
      );
      const alreadyPostedThisMonth = recurringExpenses.some((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.name === template.name &&
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() === month
        );
      });
      return recurringScheduleService.shouldPostDueBill(
        today,
        dueDate,
        alreadyPostedThisMonth,
      );
    });

    await Promise.all(
      billsToPost.map((template) =>
        transactionRepository.createTransaction({
          userId,
          name: template.name,
          avatar: template.avatar,
          amount: template.amount,
          category: template.category,
          date: recurringScheduleService.getDueDateInMonth(
            year,
            month,
            new Date(template.date).getDate(),
          ),
          recurring: true,
        }),
      ),
    );

    if (billsToPost.length > 0) {
      await balanceDbService.recalculateBalance(userId);
    }

    return billsToPost.length;
  }

  /**
   * Builds the list of templates from the full set of recurring transactions.
   *
   * For each unique `name` we keep only the most recent row. That row provides
   * the amount, category, avatar and day-of-month that will be used when
   * cloning the bill into the current month.
   */
  private getTemplates(transactions: Transaction[]): Transaction[] {
    const latestByName: Record<string, Transaction> = {};
    transactions.forEach((transaction) => {
      const currentLatest = latestByName[transaction.name];
      if (
        !currentLatest ||
        new Date(transaction.date) > new Date(currentLatest.date)
      ) {
        latestByName[transaction.name] = transaction;
      }
    });
    return Object.values(latestByName);
  }
}

const recurringDbService = new RecurringDbService();
export default recurringDbService;
