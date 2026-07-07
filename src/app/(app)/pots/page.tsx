import Pots from "@/front-end/components/pots/pots";
import { getBalanceServerAction } from "@/back-end/server-actions/balance-actions";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import potService from "@/front-end/services/pot.service";
import authService from "@/back-end/DAL/db-services/auth.service";

export default async function PotsPage() {
  const session = await authService.getSessionOrRedirectToLoginPage();

  const pots = await potRepository.getAll(session.user.id);
  const balanceResult = await getBalanceServerAction();
  const balance = balanceResult.data;
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance ? balance.current - totalSum : 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
