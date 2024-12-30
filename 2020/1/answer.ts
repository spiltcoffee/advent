import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

function findTwoExpensesProduct(expenses: number[]): number {
  const firstEntry = expenses.find((number, index, array) => {
    const inverse = 2020 - number;
    return array.slice(index + 1).includes(inverse);
  });

  return firstEntry * (2020 - firstEntry);
}

function findThreeExpensesProduct(expenses: number[]): number {
  let index: number;
  let firstEntry: number;
  let secondEntry: number;
  for ([index, firstEntry] of expenses.entries()) {
    const firstInverse = 2020 - firstEntry;
    secondEntry = expenses
      .slice(index + 1)
      .find((number, secondIndex, array) => {
        const inverse = firstInverse - number;
        return inverse > 0
          ? array.slice(secondIndex + 1).includes(inverse)
          : false;
      });
    if (secondEntry) {
      break;
    }
  }

  return firstEntry * secondEntry * (2020 - firstEntry - secondEntry);
}

export const answer: AnswerFunction = ([input]) => {
  const expenses = input.split("\n").map(Maths.parseInt);

  return [findTwoExpensesProduct(expenses), findThreeExpensesProduct(expenses)];
};
