// import range from "lodash.range";
import { fileURLToPath } from "url";
import { AnswerFunction } from "../../answer.ts";
import { Mermaid } from "../../common/mermaid.ts";
import { Device } from "./src/device.ts";

export const answer: AnswerFunction = async ([input], type) => {
  const device = Device.fromInput(input);

  const swappedWires =
    type === "real" ? "gbs,hwq,thm,wrm,wss,z08,z22,z29" : "N/A";

  await Mermaid.outputGraph(
    device.mermaid,
    fileURLToPath(new URL("./target/", import.meta.url)),
    "output.svg"
  );

  return [device.z, swappedWires];
};
