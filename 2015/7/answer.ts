import { AnswerFunction } from "../../answer.ts";
import { Device } from "./src/device.ts";

export const answer: AnswerFunction = ([input]) => {
  const device = new Device(input);
  const overriddenDevice = new Device(input);
  overriddenDevice.overrideB = device.aValue;
  return [device.aValue, overriddenDevice.aValue];
};
