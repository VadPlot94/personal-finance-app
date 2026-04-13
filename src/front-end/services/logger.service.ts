class LoggerService {
  public logError(message: string, ...data: unknown[]): void {
    console.error(message, data);
  }

  public logInfo(message: string, ...data: unknown[]): void {
    console.info(message, data);
  }

  public logWarn(message: string, ...data: unknown[]): void {
    console.warn(message, data);
  }
}

const logger = new LoggerService();
export default logger;
