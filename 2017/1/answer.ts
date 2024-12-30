import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const numbers = input.split("").map(Maths.parseInt);

  let part1RollingTotal = 0;
  let part2RollingTotal = 0;

  numbers.forEach((num, index, array) => {
    if (num === array.at(index - 1)) {
      part1RollingTotal += num;
    }
    if (num === array.at(index - array.length / 2)) {
      part2RollingTotal += num;
    }
  });

  return [part1RollingTotal, part2RollingTotal];
};
