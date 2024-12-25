import { Memoize } from "fast-typescript-memoize";
import { Value } from "./value.ts";

export class Wire {
  readonly #name: string;
  #value: Value;

  private constructor(name: string) {
    this.#name = name;
  }

  @Memoize()
  static fromName(name: string): Wire {
    return new Wire(name);
  }

  get name(): string {
    return this.#name;
  }

  set value(value: Value) {
    this.#value = value;
  }

  @Memoize()
  get computedValue(): 0 | 1 {
    return this.#value.computedValue;
  }
}
