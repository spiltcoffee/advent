import { Coordinate } from "../../../common/coordinate.ts";
import { Maths } from "../../../common/maths.ts";
import { Light } from "./light.ts";

enum InstructionType {
  ON = "ON",
  OFF = "OFF",
  TOGGLE = "TOGGLE"
}

export class Instruction {
  readonly #type: InstructionType;
  readonly #start: Coordinate;
  readonly #end: Coordinate;

  private constructor(
    type: InstructionType,
    start: Coordinate,
    end: Coordinate
  ) {
    this.#type = type;
    this.#start = start;
    this.#end = end;
  }

  static fromLine(line: string): Instruction {
    const parts = line.toUpperCase().split(" ");

    if (parts[0] === "TURN") {
      parts.shift();
    }

    const [type, startStr, , endStr] = parts as [InstructionType, ...string[]];
    const start = new Coordinate(
      ...(startStr.split(",", 2).map(Maths.parseInt) as [number, number])
    );
    const end = new Coordinate(
      ...(endStr.split(",", 2).map(Maths.parseInt) as [number, number])
    );
    return new Instruction(type, start, end);
  }

  private includes({ x, y }: Coordinate): boolean {
    return (
      x >= this.#start.x &&
      x <= this.#end.x &&
      y >= this.#start.y &&
      y <= this.#end.y
    );
  }

  private [InstructionType.ON](light: Light) {
    light.on();
  }

  private [InstructionType.OFF](light: Light) {
    light.off();
  }

  private [InstructionType.TOGGLE](light: Light) {
    light.toggle();
  }

  apply(light: Light, coordinate: Coordinate) {
    if (this.includes(coordinate)) {
      this[this.#type](light);
    }
  }
}
