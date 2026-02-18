import Pots from "@/components/pots/pots";
import { balanceRepository } from "@/repositories/balance.repository";
import { potRepository } from "@/repositories/pot.repository";
import potService from "@/services/pot.service";

export default async function PotsPage() {
  const pots = await potRepository.getAll();
  const balance = await balanceRepository.getCurrent();
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance?.current - totalSum || 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
