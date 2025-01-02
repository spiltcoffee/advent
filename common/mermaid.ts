import type { run as MermaidRun } from "@mermaid-js/mermaid-cli";
import fs from "fs/promises";
import path from "path";

type OutputFile = `${string}.${"pdf" | "svg" | "png"}`;

export class Mermaid {
  static async outputGraph(
    graph: string,
    targetDir: string,
    targetFilename: OutputFile
  ): Promise<void> {
    // we import here as it may not install in all situations.
    let mermaid: { run: typeof MermaidRun };
    try {
      mermaid = await import("@mermaid-js/mermaid-cli");
    } catch {
      console.error("Could not run mermaid, package is unavailable");
      return;
    }

    await fs.mkdir(targetDir, { recursive: true });
    const inputFile = path.join(
      targetDir,
      path.join(path.dirname(targetFilename), "input.mmd")
    );
    const outputFile = path.join(targetDir, targetFilename) as OutputFile;

    await fs.writeFile(inputFile, graph);

    await mermaid.run(inputFile, outputFile, {
      quiet: true,
      parseMMDOptions: {
        mermaidConfig: {
          maxEdges: 100000,
          flowchart: {
            defaultRenderer: "elk"
          }
        }
      }
    });
  }
}
