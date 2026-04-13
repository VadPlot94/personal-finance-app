import PotsTile from "@/front-end/components/pots/pots-tile";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";

export default async function PotsTilePage() {
  const pots = await potRepository.getAll();
  return <PotsTile pots={pots} />;
}
