import { Wire } from "./wire.ts";
import { Gate, InitialGate, AndGate, OrGate, XorGate } from "./gate.ts";

export class Device {
  readonly #wires = new Set<Wire>();
  readonly #gates = new Set<Gate>();

  private constructor() {}

  static fromInput(input: string): Device {
    const device = new Device();

    const [initial, computed] = input.split("\n\n", 2);
    initial.split("\n").forEach((line) => {
      const [name, valueStr] = line.split(": ");
      const wire = Wire.fromName(name);
      const gate = new InitialGate(Number.parseInt(valueStr, 2) as 0 | 1);
      wire.gate = gate;
      device.addWire(wire).addGate(gate);
    });

    computed.split("\n").forEach((line) => {
      const [aName, op, bName, , outputName] = line.split(" ");
      const aWire = Wire.fromName(aName);
      const bWire = Wire.fromName(bName);
      const outputWire = Wire.fromName(outputName);

      let gate: Gate;
      switch (op) {
        case "AND":
          gate = new AndGate(aWire, bWire);
          break;
        case "OR":
          gate = new OrGate(aWire, bWire);
          break;
        case "XOR":
          gate = new XorGate(aWire, bWire);
          break;
        default:
          throw new Error(`Unknown op "${op}"`);
      }
      outputWire.gate = gate;

      device.addWire(aWire).addWire(bWire).addWire(outputWire).addGate(gate);
    });

    return device;
  }

  private addWire(wire: Wire): Device {
    this.#wires.add(wire);
    return this;
  }

  private addGate(gate: Gate): Device {
    this.#gates.add(gate);
    return this;
  }

  private getWires(register: "x" | "y" | "z"): Wire[] {
    return this.#wires
      .values()
      .filter((wire) => new RegExp(`${register}\\d{2}`).exec(wire.name))
      .toArray()
      .sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
  }

  private getOutput(register: "x" | "y" | "z"): number {
    return Number.parseInt(
      this.getWires(register)
        .map(({ gate: computedValue }) => computedValue)
        .join(""),
      2
    );
  }

  get x(): number {
    return this.getOutput("x");
  }

  get y(): number {
    return this.getOutput("y");
  }

  private swapForNumber(swap: number, register: "x" | "y") {
    const binary = swap
      .toString(2)
      .split("")
      .map((binStr) => Number.parseInt(binStr, 2) as 0 | 1)
      .reverse();

    this.getWires(register)
      .reverse()
      .forEach(
        (wire, index) => (wire.swapGate = new InitialGate(binary[index] ?? 0))
      );
  }

  set swapX(swapX: number) {
    this.swapForNumber(swapX, "x");
  }

  set swapY(swapY: number) {
    this.swapForNumber(swapY, "y");
  }

  resetSwaps() {
    this.getWires("x").forEach((wire) => wire.resetSwap());
    this.getWires("y").forEach((wire) => wire.resetSwap());
  }

  get z(): number {
    return this.getOutput("z");
  }

  get expectedZ(): number {
    return this.x + this.y;
  }

  get swappedWires(): string {
    return this.#wires
      .values()
      .filter((wire) => wire.isSwapped)
      .toArray()
      .map(({ name }) => name)
      .sort()
      .join();
  }

  get mermaid(): string {
    return [
      "flowchart TD",
      ...this.#wires
        .values()
        .map((wire) => wire.mermaid)
        .filter(Boolean),
      ...this.#gates
        .values()
        .filter((gate) => !(gate instanceof InitialGate))
        .map((gate) => gate.mermaid)
    ].join("\n");
  }
}
