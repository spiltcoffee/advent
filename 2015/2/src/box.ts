import { Maths } from "../../../common/maths.ts";

export class Box {
  readonly #length: number;
  readonly #width: number;
  readonly #height: number;

  private constructor(length: number, width: number, height: number) {
    this.#length = length;
    this.#width = width;
    this.#height = height;
  }

  static fromLine(line: string): Box {
    const [length, width, height] = line.split("x").map(Maths.parseInt);
    return new Box(length, width, height);
  }

  get wrappingPaper(): number {
    const sides = [
      this.#length * this.#width,
      this.#width * this.#height,
      this.#height * this.#length
    ];
    const excess = Math.min(...sides);
    return Maths.sum(sides.map((side) => side * 2).concat(excess));
  }
}
