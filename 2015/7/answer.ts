import { AnswerFunction } from "../../answer.ts";
import { Device } from "./src/device.ts";

export const answer: AnswerFunction = ([input]) => {
  const device = new Device(input);
  return [device.aValue];
};
