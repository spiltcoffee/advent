import { AnswerFunction } from "../../answer.ts";
import { LanParty } from "./src/lanParty.ts";

export const answer: AnswerFunction = ([input]) => {
  const lanParty = LanParty.fromInput(input);

  const smallestNetworks = lanParty.findSmallestCliques(/t\w/).size;

  return [smallestNetworks, lanParty.findLargestClique(/t\w/)];
};
