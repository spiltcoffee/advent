import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const masses = input.split("\n").map(Maths.parseInt);

  const fuels = masses.map((mass) => Math.floor(mass / 3) - 2);

  const totalFuel = Maths.sum(fuels);

  return [totalFuel];
};
