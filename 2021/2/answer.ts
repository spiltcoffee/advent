import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  let distance = 0;
  let aim = 0;
  let depth = 0;

  input.split("\n").forEach((line) => {
    const [action, numStr] = line.split(" ");
    const num = Number.parseInt(numStr, 10);

    switch (action) {
      case "forward":
        distance += num;
        depth += num * aim;
        break;
      case "down":
        aim += num;
        break;
      case "up":
        aim -= num;
        break;
      default:
        throw new Error(`Unknown action "${action}"`);
    }
  });

  const part1Course = distance * aim;
  const part2Course = distance * depth;

  return [part1Course, part2Course];
};
