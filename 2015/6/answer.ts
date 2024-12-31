import { AnswerFunction } from "../../answer.ts";
import { Instruction } from "./src/instruction.ts";
import { LightGrid } from "./src/lightGrid.ts";

export const answer: AnswerFunction = ([input]) => {
  const instructions = input.split("\n").map(Instruction.fromLine);
  const lightGrid = new LightGrid();
  instructions.forEach((instruction) =>
    lightGrid.applyInstruction(instruction)
  );
  return [lightGrid.lightsOnCount];
};
