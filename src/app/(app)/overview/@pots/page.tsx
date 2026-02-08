import PotsTile from "@/components/pots/pots-tile";
import { potRepository } from "@/repositories/pot.repository";

export default async function PotsTilePage() {
  const pots = await potRepository.getAll();
  return <PotsTile pots={pots} />;
}
