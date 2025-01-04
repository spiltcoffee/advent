import { AnswerFunction } from "../../answer.ts";
import { LNSGraph } from "./src/lnsGraph.ts";

export const answer: AnswerFunction = ([input]) => {
  const graph = new LNSGraph();
  const element = graph.fromValue(input);
  return [
    element.getLengthAtDepth(40, graph),
    element.getLengthAtDepth(50, graph)
  ];
};
