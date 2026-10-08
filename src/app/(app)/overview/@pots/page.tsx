import { ensureSessionServerAction } from "@/back-end/server-actions/auth-actions";
import { getAllPotsServerAction } from "@/back-end/server-actions/pot-actions";
import PotsTile from "@/front-end/components/pots/pots-tile";

export default async function PotsTilePage() {
  await ensureSessionServerAction();

  const potsResult = await getAllPotsServerAction();
  return <PotsTile pots={potsResult.data ?? []} />;
}
