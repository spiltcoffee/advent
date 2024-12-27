import { Memoize } from "fast-typescript-memoize";
import { Gate, InitialGate } from "./gate.ts";

export class Wire {
  readonly #name: string;
  #gate: Gate;
  #swapGate: Gate;

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

  set gate(gate: Gate) {
    this.#gate = gate;
  }

  set swapGate(swapGate: Gate) {
    this.#swapGate = swapGate;
  }

  get isSwapped(): boolean {
    return !!this.#swapGate;
  }

  resetSwap() {
    this.#swapGate = undefined;
  }

  static swap(aWire: Wire, bWire: Wire) {
    bWire.#swapGate = aWire.#gate;
    aWire.#swapGate = bWire.#gate;
  }

  get gate(): 0 | 1 {
    return (this.#swapGate || this.#gate).value;
  }

  get mermaid(): string {
    return !(this.#gate instanceof InitialGate)
      ? `    ${this.#gate.name}[${this.#gate.type}] === ${this.#name}{${this.#name}}`
      : "";
  }
}
