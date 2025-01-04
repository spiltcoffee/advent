import { LNSGraph } from "./lnsGraph.ts";
import { Maths } from "../../../common/maths.ts";

export class LookAndSay {
  readonly #name: string;
  #value: string;
  #decaysTo: LookAndSay[];
  readonly #lengthAtDepth: number[] = [];

  constructor(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    this.#value = value;
    this.#lengthAtDepth[0] = value.length;
  }

  set decaysTo(decaysTo: LookAndSay[]) {
    this.#decaysTo = decaysTo;
  }

  getLengthAtDepth(depth: number, graph: LNSGraph): number {
    this.calculateDecaysTo(graph);
    this.#lengthAtDepth[depth] ||= Maths.sum(
      this.#decaysTo.map((element) =>
        element.getLengthAtDepth(depth - 1, graph)
      )
    );
    return this.#lengthAtDepth[depth];
  }

  calculateDecaysTo(graph: LNSGraph): void {
    if (this.#decaysTo) {
      return;
    }

    let count = 1;
    const decayValue = this.#value
      .split("")
      .reduce((str, num, index, array) => {
        const prevNum = array[index - 1];

        if (num === prevNum) {
          count++;
        }

        if (prevNum && num !== prevNum) {
          str += count + prevNum;
          count = 1;
        }

        if (index === array.length - 1) {
          str += count + num;
        }

        return str;
      }, "");

    this.#decaysTo = [graph.fromValue(decayValue)];
  }
}
