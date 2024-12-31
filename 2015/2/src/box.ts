import { Maths } from "../../../common/maths.ts";

export class Box {
  readonly #edges: number[];

  private constructor(edges: number[]) {
    this.#edges = edges;
  }

  static fromLine(line: string): Box {
    const edges = line.split("x").map(Maths.parseInt);
    return new Box(edges);
  }

  get wrappingPaper(): number {
    const sides = this.#edges.reduce(
      (sides, edge, index, array) => sides.concat(edge * array.at(index - 1)),
      []
    );
    const excess = Math.min(...sides);
    return Maths.sum(sides.map((side) => side * 2).concat(excess));
  }

  get ribbon(): number {
    return (
      Maths.sum(
        this.#edges
          .toSorted(Maths.compAsc)
          .slice(0, 2)
          .map((edge) => edge * 2)
      ) + this.#edges.reduce((total, edge) => total * edge, 1)
    );
  }
}
