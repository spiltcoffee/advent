import { AnswerFunction } from "../../answer.ts";

function encode(line: string): string {
  return `"${line.replaceAll(/(["\\])/g, "\\$1")}"`;
}

export const answer: AnswerFunction = ([input]) => {
  const lines = input.split("\n");
  const part1Diff = lines.reduce(
    (diff, line) => diff + line.length - eval(line).length,
    0
  );
  const part2Diff = lines.reduce(
    (diff, line) => diff + encode(line).length - line.length,
    0
  );
  return [part1Diff, part2Diff];
};
