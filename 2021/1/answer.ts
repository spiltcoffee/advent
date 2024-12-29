import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const depths = input.split("\n").map(str => Number.parseInt(str, 10));
  
  let increments = 0;
  depths.reduce((prev, curr) => {
    if (curr > prev) {
      increments++;
    }
    return curr;
  }, Infinity);

  return [increments.toString(), ""];
};
