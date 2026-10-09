import { ensureSessionServerAction } from "@/back-end/server-actions/auth-actions";
import { getBalanceServerAction } from "@/back-end/server-actions/balance-actions";
import { getAllPotsServerAction } from "@/back-end/server-actions/pot-actions";
import Pots from "@/front-end/components/pots/pots";
import potService from "@/shared/services/pot.service";

export default async function PotsPage() {
  await ensureSessionServerAction();

  const [potsResult, balanceResult] = await Promise.all([
    getAllPotsServerAction(),
    getBalanceServerAction(),
  ]);
  const pots = potsResult.data ?? [];
  const balance = balanceResult.data;
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance ? balance.current - totalSum : 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
