import { Wire } from "./wire.ts";

export abstract class Gate {
  protected static readonly MAX_INT = 2 ** 16 - 1;

  abstract get value(): number;
}

export class WireGate extends Gate {
  readonly #wire: Wire;

  constructor(wire: Wire) {
    super();
    this.#wire = wire;
  }

  get value(): number {
    return this.#wire.value;
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

  get value(): number {
    //console.log("and", this.#aWire.name, this.#bWire.name);
    return this.#aWire.value & this.#bWire.value;
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

  get value(): number {
    return this.#aWire.value | this.#bWire.value;
  }
}

export class NotGate extends Gate {
  readonly #wire: Wire;

  constructor(wire: Wire) {
    super();
    this.#wire = wire;
  }

  get value(): number {
    return ~this.#wire.value & Gate.MAX_INT;
  }
}

export class LeftShiftGate extends Gate {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get value(): number {
    return (this.#aWire.value << this.#bWire.value) & Gate.MAX_INT;
  }
}

export class RightShiftGate extends Gate {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get value(): number {
    return this.#aWire.value >> this.#bWire.value;
  }
}
