export abstract class BaseRepository<
  ModelDelegate extends {
    findMany: (...args: any[]) => Promise<any[]>;
    findUnique: (...args: any[]) => Promise<any | null>;
    create: (...args: any[]) => Promise<any>;
    update: (...args: any[]) => Promise<any>;
    delete: (...args: any[]) => Promise<any>;
    findFirst: (...args: any[]) => Promise<any | null>;
    upsert: (...args: any[]) => Promise<any | null>;
    // Add aggregate, groupBy, count, if used
  },
> {
  protected model: ModelDelegate;

  constructor(model: ModelDelegate) {
    this.model = model;
  }

  async findMany(args?: Parameters<ModelDelegate["findMany"]>[0]) {
    return this.model.findMany(args);
  }

  async findUnique(args: Parameters<ModelDelegate["findUnique"]>[0]) {
    return this.model.findUnique(args);
  }

  async findFirst(args: Parameters<ModelDelegate["findFirst"]>[0]) {
    return this.model.findFirst(args);
  }

  async create(args: Parameters<ModelDelegate["create"]>[0]) {
    return this.model.create(args);
  }

  /* Создать или обновить бюджет (upsert)
   * Если запись уже существует (по уникальному ключу) → обнови её (update)
   * Если записи нет → создай новую (insert)
   */
  async upsert(args: Parameters<ModelDelegate["upsert"]>[0]) {
    return this.model.upsert(args);
  }

  async update(args: Parameters<ModelDelegate["update"]>[0]) {
    return this.model.update(args);
  }

  async delete(args: Parameters<ModelDelegate["delete"]>[0]) {
    return this.model.delete(args);
  }
}
