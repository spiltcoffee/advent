import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

function calculateFuel(mass: number): number {
  return Math.floor(mass / 3) - 2;
}

function recurseFuel(mass: number): number {
  const fuel = calculateFuel(mass);
  if (fuel > 0) {
    return fuel + recurseFuel(fuel);
  }

  return 0;
}

export const answer: AnswerFunction = ([input]) => {
  const masses = input.split("\n").map(Maths.parseInt);

  const simpleFuelTotal = Maths.sum(masses.map(calculateFuel));

  const advancedFuelTotal = Maths.sum(masses.map(recurseFuel));

  return [simpleFuelTotal, advancedFuelTotal];
};
