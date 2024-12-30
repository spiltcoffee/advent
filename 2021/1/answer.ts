import { AnswerFunction } from "../../answer.ts";

function sum(nums: number[]): number {
  return nums.reduce((total, num) => total + num, 0);
}

export const answer: AnswerFunction = ([input]) => {
  const depths = input.split("\n").map((str) => Number.parseInt(str, 10));

  let part1Increments = 0;
  depths.reduce((prev, curr) => {
    if (curr > prev) {
      part1Increments++;
    }
    return curr;
  }, Infinity);

  let part2Increments = 0;
  depths.reduce(
    (prevArr, curr) => {
      const currArr = prevArr.slice(1).concat(curr);

      if (sum(currArr) > sum(prevArr)) {
        part2Increments++;
      }

      return currArr;
    },
    [Infinity, Infinity, Infinity]
  );

  return [part1Increments, part2Increments];
};
