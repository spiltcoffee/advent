// import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";
import { Device } from "./src/device.ts";

export const answer: AnswerFunction = async ([input], type) => {
  const device = Device.fromInput(input);

  const swappedWires =
    type === "real" ? "gbs,hwq,thm,wrm,wss,z08,z22,z29" : "N/A";

  // /* I spat out a mermaid diagram of the nodes and manually examined it for mistakes,
  // under the assumption the "device" was a ripple-carry adder. Uncomment the lines below
  // to generate the diagram. */
  // const { fileURLToPath } = await import("url");
  // const fs = await import("fs/promises");
  // const mermaid = await import("@mermaid-js/mermaid-cli");

  // const targetDir = new URL("./target/", import.meta.url);
  // await fs.mkdir(targetDir, { recursive: true });
  // const inputFile = fileURLToPath(new URL("./input.mmd", targetDir));
  // console.log(inputFile);
  // const outputFile = fileURLToPath(
  //   new URL("./output.svg", targetDir)
  // ) as `${string}.pdf`;
  // await fs.writeFile(inputFile, device.mermaid);
  // await mermaid.run(inputFile, outputFile, {
  //   parseMMDOptions: {
  //     mermaidConfig: {
  //       maxEdges: 100000,
  //       flowchart: {
  //         defaultRenderer: "elk"
  //       }
  //     }
  //   }
  // });

  return [device.z.toString(), swappedWires];
};
