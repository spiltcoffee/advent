import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

function sumOfNums(input: string): number {
  return Maths.sum(
    input.matchAll(/(-?\d+)/g).map(([num]) => Number.parseInt(num, 10))
  );
}

function excludeRed(input: string): string {
  return JSON.stringify(
    JSON.parse(input, (key, value) =>
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value).includes("red")
        ? undefined
        : value
    )
  );
}

export const answer: AnswerFunction = ([input]) => {
  return [sumOfNums(input), sumOfNums(excludeRed(input))];
};
