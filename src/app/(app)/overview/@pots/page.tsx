import authService from "@/back-end/DAL/db-services/auth.service";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import PotsTile from "@/front-end/components/pots/pots-tile";

export default async function PotsTilePage() {
  const session = await authService.getSessionOrRedirectToLoginPage();

  const pots = await potRepository.getAll(session.user.id);
  return <PotsTile pots={pots} />;
}
