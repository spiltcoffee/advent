import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const diff = input
    .split("\n")
    .reduce((diff, line) => diff + line.length - eval(line).length, 0);
  return [diff];
};
