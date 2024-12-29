import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  let distance = 0;
  let depth = 0;

  input.split("\n").forEach((line) => {
    const [action, numStr] = line.split(" ");
    const num = Number.parseInt(numStr, 10);

    switch (action) {
      case "forward":
        distance += num;
        break;
      case "down":
        depth += num;
        break;
      case "up":
        depth -= num;
        break;
      default:
        throw new Error(`Unknown action "${action}"`);
    }
  });

  const course = distance * depth;

  return [course.toString(), ""];
};
