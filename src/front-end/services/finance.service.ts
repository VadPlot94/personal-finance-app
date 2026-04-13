class FinanceService {
  public calculateProgressPercentage(current: number, target: number): number {
    if (!target) {
      return 100.0;
    }
    if (!current || isNaN(current)) {
      return 0.0;
    }
    const percentage = (current / target) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    const rounded = Math.round(clamped * 100) / 100;
    return Number(rounded.toFixed(2));
  }

  public getStrPercentage(value: number): string {
    return isNaN(value) ? "--.--%" : `${value.toFixed(2)}%`;
  }

  public createCacheNumberFormat(val: string | number | undefined): string {
    const value = val?.toString();
    if (!value || value.trim() === "" || isNaN(+value)) {
      return value || "";
    }
    const [integer, decimal = ""] = value.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  }
}

const financeService = new FinanceService();
export default financeService;
