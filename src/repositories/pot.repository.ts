
import prisma from '@/prisma/prisma-client';
import { BaseRepository } from './base.repository';
import { Pot } from '@prisma/client';

export class PotRepository extends BaseRepository<typeof prisma.pot> {
  constructor() {
    super(prisma.pot);
  }

  /**
   * Получить все копилки (с сортировкой по имени)
   */
  async getAll(): Promise<Pot[]> {
    return this.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Получить копилку по имени
   */
  async getByName(name: string): Promise<Pot | null> {
    return this.findFirst({
      where: { name },
    });
  }

  /**
   * Создать новую копилку
   */
  async createPot(data: {
    name: string;
    target: number;
    total?: number;
    theme: string;
  }): Promise<Pot> {
    return this.create({
      data: {
        name: data.name,
        target: data.target,
        total: data.total ?? 0,
        theme: data.theme,
      },
    });
  }

  /**
   * Обновить текущую сумму в копилке (добавление/снятие)
   */
  async addToPot(id: string, amount: number): Promise<Pot> {
    return this.update({
      where: { id },
      data: {
        total: {
          increment: amount,
        },
      },
    });
  }

  /**
   * Получить прогресс всех копилок (сколько осталось до цели)
   */
  async getProgress(): Promise<Array<{
    name: string;
    target: number;
    total: number;
    progress: number;
  }>> {
    const pots = await this.findMany();
    return pots.map(pot => ({
      name: pot.name,
      target: pot.target,
      total: pot.total,
      progress: pot.target > 0 ? (pot.total / pot.target) * 100 : 0,
    }));
  }
}

export const potRepository = new PotRepository();