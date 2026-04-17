// lib/repositories/base.repository.ts
import { Prisma, PrismaClient } from "@prisma/client";

export abstract class BaseRepository<ModelName extends keyof PrismaClient> {
  protected model: any; // ← Ключевой момент: any здесь упрощает жизнь

  constructor(model: PrismaClient[ModelName]) {
    this.model = model;
  }

  // ====================== CREATE ======================
  async create<T extends Prisma.Args<PrismaClient[ModelName], "create">>(
    args: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "create">> {
    return this.model.create(args) as Promise<
      Prisma.Result<PrismaClient[ModelName], T, "create">
    >;
  }

  /**
   * Checks if a prop can be used for a appropriate object model.
   * - When creating (no id provided): the prop must not exist at all.
   * - When editing (id provided): the prop must not be used by any other object model (excluding the current one).
   */
  public async isUnique<K extends string>(
    field: K,
    value: any,
    excludeId?: string | null,
  ): Promise<boolean> {
    const existing = await this.findFirst({
      where: {
        [field]: value,
        // If id is provided — exclude the current pot from the check
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: { id: true }, // minimal data
    } as any);

    // true = prop does not exist and available, false = prop already used
    return !existing;
  }

  // ====================== FIND ======================
  async findUnique<
    T extends Prisma.Args<PrismaClient[ModelName], "findUnique">,
  >(
    args: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "findUnique"> | null> {
    return this.model.findUnique(args) as any;
  }

  async findFirst<T extends Prisma.Args<PrismaClient[ModelName], "findFirst">>(
    args?: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "findFirst"> | null> {
    return this.model.findFirst(args) as any;
  }

  async findMany<T extends Prisma.Args<PrismaClient[ModelName], "findMany">>(
    args?: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "findMany">> {
    return this.model.findMany(args) as any;
  }

  // ====================== UPDATE ======================
  async update<T extends Prisma.Args<PrismaClient[ModelName], "update">>(
    args: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "update">> {
    return this.model.update(args) as any;
  }

  // ====================== DELETE ======================
  async delete<T extends Prisma.Args<PrismaClient[ModelName], "delete">>(
    args: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "delete">> {
    return this.model.delete(args) as any;
  }

  // ====================== UPSERT ======================
  async upsert<T extends Prisma.Args<PrismaClient[ModelName], "upsert">>(
    args: T,
  ): Promise<Prisma.Result<PrismaClient[ModelName], T, "upsert">> {
    return this.model.upsert(args) as any;
  }

  // ====================== COUNT ======================
  async count<T extends Prisma.Args<PrismaClient[ModelName], "count">>(
    args?: T,
  ): Promise<number> {
    return this.model.count(args) as Promise<number>;
  }

  /**
   * Ensure that an object belongs to a specific user.
   * Uses the model's id and userId fields by default.
   */
  async ensureDataOwnership(
    id: string,
    userId: string,
    options?: {
      idField?: string;
      userIdField?: string;
      select?: Record<string, boolean>;
    },
  ): Promise<boolean> {
    const idField = options?.idField ?? "id";
    const userIdField = options?.userIdField ?? "userId";

    const item = await this.findFirst({
      where: {
        [idField]: id,
        [userIdField]: userId,
      },
      select: options?.select ?? { id: true },
    } as any);

    return !!item;
  }
}
