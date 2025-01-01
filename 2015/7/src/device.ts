import { Maths } from "../../../common/maths.ts";
import {
  AndGate,
  LeftShiftGate,
  NotGate,
  OrGate,
  RightShiftGate,
  WireGate
} from "./gate.ts";
import { FixedWire, NamedWire, Wire } from "./wire.ts";

export class Device {
  readonly #wires = new Set<Wire>();

  private readonly SEPARATOR = "->";

  constructor(input: string) {
    input.split("\n").forEach((line) => {
      const parts = line.split(" ");
      if (parts[1] === this.SEPARATOR) {
        this.getNamedWire(parts[2]).gate = new WireGate(this.getWire(parts[0]));
      } else if (parts[2] === this.SEPARATOR) {
        this.getNamedWire(parts[3]).gate = new NotGate(this.getWire(parts[1]));
      } else {
        const wire = this.getNamedWire(parts[4]);
        const aWire = this.getWire(parts[0]);
        const bWire = this.getWire(parts[2]);
        switch (parts[1]) {
          case "AND":
            wire.gate = new AndGate(aWire, bWire);
            break;
          case "OR":
            wire.gate = new OrGate(aWire, bWire);
            break;
          case "LSHIFT":
            wire.gate = new LeftShiftGate(aWire, bWire);
            break;
          case "RSHIFT":
            wire.gate = new RightShiftGate(aWire, bWire);
            break;
          default:
            throw new Error(`Confusing line "${line}"`);
        }
      }
    });
  }

  private getNamedWire(name: string): NamedWire {
    const wire = this.getWire(name);

    if (!(wire instanceof NamedWire)) {
      throw new Error(`Expected a named wire, but found "${name}"`);
    }

    return wire;
  }

  private getWire(nameOrValue: string) {
    const value = Maths.parseInt(nameOrValue);

    const wire = Number.isNaN(value)
      ? NamedWire.fromName(nameOrValue)
      : new FixedWire(value);

    this.#wires.add(wire);

    return wire;
  }

  get aValue(): number {
    return this.#wires.values().find(({ name }) => name === "a").value;
  }
}
