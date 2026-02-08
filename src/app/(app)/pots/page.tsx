import Pots from "@/components/pots/pots";
import { potRepository } from "@/repositories/pot.repository";

export default async function PotsPage() {
  const pots = await potRepository.getAll();
  return <Pots pots={pots} />;
}
