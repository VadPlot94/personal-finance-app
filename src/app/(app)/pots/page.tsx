import { Suspense } from "react";
import authService from "@/back-end/DAL/db-services/auth.service";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import { getBalanceServerAction } from "@/back-end/server-actions/balance-actions";
import Pots from "@/front-end/components/pots/pots";
import potService from "@/shared/services/pot.service";

export default function PotsPage() {
  return (
    <Suspense fallback={<Pots pots={null} availableBalance={0} />}>
      <PotsPageContent />
    </Suspense>
  );
}

async function PotsPageContent() {
  const session = await authService.getSessionOrRedirectToLoginPage();

  const pots = await potRepository.getAll(session.user.id);
  const balanceResult = await getBalanceServerAction();
  const balance = balanceResult.data;
  const totalSum = potService.getAllSavedPotsMoney(pots);
  const availableBalance = balance ? balance.current - totalSum : 0;

  return <Pots pots={pots} availableBalance={availableBalance} />;
}
