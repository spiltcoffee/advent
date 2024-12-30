import { AnswerFunction } from "../../answer.ts";
import { RobotInput } from "./src/robotInput.ts";

export const answer: AnswerFunction = ([input]) => {
  const codes = input.split("\n");
  return [
    RobotInput.getComplexity(codes, 2 + 1),
    RobotInput.getComplexity(codes, 25 + 1)
  ];
};
