import authController from "@/back-end/controllers/auth-controller";
import balanceController from "@/back-end/controllers/balance-controller";
import potController from "@/back-end/controllers/pot-controller";
import Pots from "@/front-end/components/pots/pots";
import potService from "@/shared/services/pot.service";

export default async function PotsPage() {
  await authController.ensureSession();

  const [potsResult, balanceResult] = await Promise.all([
    potController.getAllPots(),
    balanceController.getBalance(),
  ]);
  const pots = potsResult.data ?? [];
  const balance = balanceResult.data;
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance ? balance.current - totalSum : 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
