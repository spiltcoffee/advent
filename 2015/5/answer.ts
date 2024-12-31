import { AnswerFunction } from "../../answer.ts";
import { Detector } from "./src/detector.ts";

export const answer: AnswerFunction = ([input]) => {
  const detectors = input.split("\n").map(Detector.fromLine);

  const niceCount = detectors
    .map((detector) => detector.isNice)
    .filter(Boolean).length;

  return [niceCount];
};
