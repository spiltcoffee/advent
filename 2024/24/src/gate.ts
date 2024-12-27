import { Wire } from "./wire.ts";

let id = 0;
export abstract class Gate {
  readonly #id: number;

  protected constructor() {
    this.#id = id++;
  }

  get name(): string {
    return `gate${this.#id}`;
  }

  abstract get value(): 0 | 1;
  abstract get type(): string;
  protected abstract get wireNames(): string[];

  get mermaid(): string {
    return this.wireNames
      .map((wireName) => `    ${wireName}{${wireName}} --> ${this.name}`)
      .join("\n");
  }
}

export class InitialGate extends Gate {
  readonly #value: 0 | 1;

  constructor(value: 0 | 1) {
    super();
    this.#value = value;
  }

  get value(): 0 | 1 {
    return this.#value;
  }

  get type(): string {
    throw new Error("Not implemented");
  }

  get wireNames(): string[] {
    throw new Error("Not implemented");
  }
}

export class AndGate extends Gate {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get value(): 0 | 1 {
    return (this.#aWire.gate & this.#bWire.gate) as 0 | 1;
  }

  get type(): string {
    return "AND";
  }

  protected get wireNames(): string[] {
    return [this.#aWire.name, this.#bWire.name];
  }
}

export class OrGate extends Gate {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get value(): 0 | 1 {
    return (this.#aWire.gate | this.#bWire.gate) as 0 | 1;
  }

  get type(): string {
    return "OR";
  }

  protected get wireNames(): string[] {
    return [this.#aWire.name, this.#bWire.name];
  }
}

export class XorGate extends Gate {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get value(): 0 | 1 {
    return (this.#aWire.gate ^ this.#bWire.gate) as 0 | 1;
  }

  get type(): string {
    return "XOR";
  }

  protected get wireNames(): string[] {
    return [this.#aWire.name, this.#bWire.name];
  }
}
