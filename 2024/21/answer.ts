import { AnswerFunction } from "../../answer.ts";
import { RobotInput } from "./src/robotInput.ts";

export const answer: AnswerFunction = ([input]) => {
  const codes = input.split("\n");
  return [
    RobotInput.getComplexity(codes, 3).toString(),
    RobotInput.getComplexity(codes, 26).toString()
  ];
};
