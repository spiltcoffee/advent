import fs from "fs";
import { fileURLToPath } from "url";
import { Memoize } from "fast-typescript-memoize";
import { LookAndSay } from "./lookAndSay.ts";

export class LNSGraph {
  readonly #graph = new Set<LookAndSay>();

  constructor() {
    this.init();
  }

  @Memoize()
  fromValue(value: string): LookAndSay {
    const element = this.#graph
      .values()
      .find((element) => element.value === value);
    if (element) {
      return element;
    }

    const newElement = new LookAndSay(`raw${value}`);
    newElement.value = value;
    this.#graph.add(newElement);
    return newElement;
  }

  @Memoize()
  private fromName(name: string): LookAndSay {
    const element = this.#graph
      .values()
      .find((element) => element.name === name);
    if (element) {
      return element;
    }

    const newElement = new LookAndSay(name);
    this.#graph.add(newElement);
    return newElement;
  }

  private init() {
    const conway = fs.readFileSync(
      fileURLToPath(new URL("./conway.txt", import.meta.url)),
      "UTF-8"
    );
    conway
      .trim()
      .split("\n")
      .forEach((line) => {
        const [name, value, decaysToStr] = line.split(" ");
        const element = this.fromName(name);
        element.value = value;
        element.decaysTo = decaysToStr
          .split(",")
          .map((name) => this.fromName(name));
      });
  }
}
