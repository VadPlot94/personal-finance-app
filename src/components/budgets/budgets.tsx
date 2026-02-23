import { IBudgetsProps } from "../types";

export default function Budgets({ budgets = [] }: IBudgetsProps) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-bold text-3xl">Budgets</div>
      </div>
      <div className="grid grid-cols-2 justify-between gap-5">test</div>
    </>
  );
}
