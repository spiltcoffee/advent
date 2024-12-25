import { Wire } from "./wire.ts";
import { FixedValue, AndValue, OrValue, XorValue } from "./value.ts";

export class Device {
  readonly #wires = new Set<Wire>();

  private constructor() {}

  static fromInput(input: string): Device {
    const device = new Device();

    const [initial, computed] = input.split("\n\n", 2);
    initial.split("\n").forEach((line) => {
      const [name, valueStr] = line.split(": ");
      const wire = Wire.fromName(name);
      wire.value = new FixedValue(Number.parseInt(valueStr, 2) as 0 | 1);
      device.addWire(wire);
    });

    computed.split("\n").forEach((line) => {
      const [aName, op, bName, , outputName] = line.split(" ");
      const aWire = Wire.fromName(aName);
      const bWire = Wire.fromName(bName);
      const outputWire = Wire.fromName(outputName);

      switch (op) {
        case "AND":
          outputWire.value = new AndValue(aWire, bWire);
          break;
        case "OR":
          outputWire.value = new OrValue(aWire, bWire);
          break;
        case "XOR":
          outputWire.value = new XorValue(aWire, bWire);
          break;
        default:
          throw new Error(`Unknown op "${op}"`);
      }

      device.addWire(aWire).addWire(bWire).addWire(outputWire);
    });

    return device;
  }

  private addWire(wire: Wire): Device {
    this.#wires.add(wire);
    return this;
  }

  private get zWires(): Wire[] {
    return this.#wires
      .values()
      .filter((wire) => /z\d{2}/.exec(wire.name))
      .toArray()
      .sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
  }

  get output(): number {
    return Number.parseInt(
      this.zWires.map(({ computedValue }) => computedValue).join(""),
      2
    );
  }
}
