import { Memoize } from "fast-typescript-memoize";
import { Gate } from "./gate.ts";

export abstract class Wire {
  abstract get value(): number;
  abstract get name(): string;
}

export class FixedWire extends Wire {
  readonly #value: number;

  constructor(value: number) {
    super();
    this.#value = value;
  }

  get value(): number {
    return this.#value;
  }

  get name(): string {
    return `fixed(${this.#value})`;
  }
}

export class NamedWire extends Wire {
  readonly #name: string;
  #gate: Gate;

  constructor(name: string) {
    super();
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  set gate(gate: Gate) {
    this.#gate = gate;
  }

  @Memoize()
  get value(): number {
    return this.#gate.value;
  }
}
