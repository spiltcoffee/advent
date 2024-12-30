import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const numbers = input.split("").map(Maths.toNumber);

  let rollingTotal = 0;

  numbers.reduce((prev, curr) => {
    if (prev === curr) {
      rollingTotal += curr;
    }
    return curr;
  }, numbers.at(-1));

  return [rollingTotal];
};
