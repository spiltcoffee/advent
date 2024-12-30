import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const expenses = input.split("\n").map(Maths.parseInt);

  const firstEntry = expenses.find((number, index, array) => {
    const inverse = 2020 - number;
    return array.slice(index + 1).includes(inverse);
  });

  const entryProduct = firstEntry * (2020 - firstEntry);

  return [entryProduct];
};
