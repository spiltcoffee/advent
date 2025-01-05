import { AnswerFunction } from "../../answer.ts";
import { Reindeer } from "./src/reindeer.ts";
import range from "lodash.range";

export const answer: AnswerFunction = ([input], type) => {
  const travelTime = type === "real" ? 2503 : 1000;
  const reindeer = input.split("\n").map(Reindeer.fromInput);
  const furtherest = Math.max(
    ...reindeer.map((deer) => deer.travel(travelTime))
  );

  const points = new Map<Reindeer, number>();
  reindeer.forEach((deer) => points.set(deer, 0));
  range(1, travelTime + 1).forEach((time) => {
    const furtherest = Math.max(...reindeer.map((deer) => deer.travel(time)));
    reindeer
      .filter((deer) => deer.travel(time) === furtherest)
      .forEach((deer) => points.set(deer, points.get(deer) + 1));
  });

  const mostPoints = Math.max(...points.values());

  return [furtherest, mostPoints];
};
