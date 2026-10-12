import { ensureSessionSRF } from "@/back-end/server-actions/auth-actions";
import { getAllPotsSRF } from "@/back-end/server-actions/pot-actions";
import PotsTile from "@/front-end/components/pots/pots-tile";

export default async function PotsTilePage() {
  await ensureSessionSRF();

  const potsResult = await getAllPotsSRF();
  return <PotsTile pots={potsResult.data ?? []} />;
}
