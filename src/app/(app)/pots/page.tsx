import Pots from "@/front-end/components/pots/pots";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import potService from "@/front-end/services/pot.service";

export default async function PotsPage() {
  const pots = await potRepository.getAll();
  const balance = await balanceRepository.getCurrent();
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance?.current - totalSum || 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
