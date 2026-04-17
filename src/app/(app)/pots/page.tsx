import Pots from "@/front-end/components/pots/pots";
import { balanceRepository } from "@/back-end/DAL/repositories/balance.repository";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import potService from "@/front-end/services/pot.service";
import authService from "@/back-end/DAL/db-services/auth.service";

export default async function PotsPage() {
  const session = await authService.getSessionOrRedirectToLoginPage();

  const pots = await potRepository.getAll(session.user.id);
  const balance = await balanceRepository.getCurrent(session.user.id);
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance ? balance.current - totalSum : 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
