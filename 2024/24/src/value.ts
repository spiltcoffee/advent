import { Wire } from "./wire.ts";

export abstract class Value {
  get computedValue(): 0 | 1;
}

export class FixedValue extends Value {
  readonly #value: 0 | 1;

  constructor(value: 0 | 1) {
    super();
    this.#value = value;
  }

  get computedValue(): 0 | 1 {
    return this.#value;
  }
}

export class AndValue extends Value {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get computedValue(): 0 | 1 {
    return this.#aWire.computedValue & this.#bWire.computedValue;
  }
}

export class OrValue extends Value {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get computedValue(): 0 | 1 {
    return this.#aWire.computedValue | this.#bWire.computedValue;
  }
}

export class XorValue extends Value {
  readonly #aWire: Wire;
  readonly #bWire: Wire;

  constructor(aWire: Wire, bWire: Wire) {
    super();
    this.#aWire = aWire;
    this.#bWire = bWire;
  }

  get computedValue(): 0 | 1 {
    return this.#aWire.computedValue ^ this.#bWire.computedValue;
  }
}
