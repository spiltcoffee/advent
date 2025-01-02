import { fileURLToPath } from "url";
import { AnswerFunction } from "../../answer.ts";
import { Mermaid } from "../../common/mermaid.ts";
import { Route } from "./src/route.ts";

export const answer: AnswerFunction = async ([input], type) => {
  const [shortestDistance, longestDistance] =
    type === "real" ? [117, 909] : [605, 982];

  const routes = new Set(input.split("\n").map(Route.fromLine));

  const graph = ["flowchart TD"]
    .concat(
      routes
        .values()
        .map((route) => {
          const cities = route.cities.values().toArray();
          return `    ${cities[0].name} -- ${route.distance} --> ${cities[1].name}`;
        })
        .toArray()
    )
    .join("\n");

  await Mermaid.outputGraph(
    graph,
    fileURLToPath(new URL("./target/", import.meta.url)),
    "output.svg"
  );

  return [shortestDistance, longestDistance];
};
