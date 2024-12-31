import { AnswerFunction } from "../../answer.ts";
import { Instruction } from "./src/instruction.ts";
import { LightGrid } from "./src/lightGrid.ts";
import { FixedLight } from "./src/fixedLight.ts";
import { ControlledLight } from "./src/controlledLight.ts";

export const answer: AnswerFunction = ([input]) => {
  const instructions = input.split("\n").map(Instruction.fromLine);
  const fixedLightGrid = new LightGrid(FixedLight);
  const controlledLightGrid = new LightGrid(ControlledLight);

  instructions.forEach((instruction) => {
    fixedLightGrid.applyInstruction(instruction);
    controlledLightGrid.applyInstruction(instruction);
  });

  return [fixedLightGrid.lightsOn, controlledLightGrid.lightsOn];
};
