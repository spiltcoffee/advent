import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";
import { Box } from "./src/box.ts";

export const answer: AnswerFunction = ([input]) => {
  const boxes = input.split("\n").map(Box.fromLine);

  const wrappingPaper = Maths.sum(boxes.map((box) => box.wrappingPaper));
  const ribbon = Maths.sum(boxes.map((box) => box.ribbon));

  return [wrappingPaper, ribbon];
};
