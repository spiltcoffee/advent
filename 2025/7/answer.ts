import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Direction } from "../../common/direction.ts";
import { Map } from "../../common/map.ts";

const SURROUNDING_COORDS = [Direction.EAST, Direction.WEST].map(
  Coordinate.fromDirection
);

const BELOW_COORD = Coordinate.fromDirection(Direction.SOUTH);

export const answer: AnswerFunction = ([input]) => {
  const manifold = Manifold.fromInput(input);
  const timelines = manifold.acceptBeam();
  return [manifold.splits, timelines];
};

interface ManifoldCell {
  hasBeam: boolean;
  hasSplit: boolean;
  acceptBeam(manifold: Manifold, coord: Coordinate): void;
}

class Space implements ManifoldCell {
  readonly hasSplit = false;
  #hasBeam = false;
  #timelines = 0;

  get hasBeam(): boolean {
    return this.#hasBeam;
  }

  acceptBeam(manifold: Manifold, coord: Coordinate): number {
    if (this.#hasBeam) {
      return this.#timelines;
    }

    this.#hasBeam = true;
    const belowCoord = coord.add(BELOW_COORD);
    this.#timelines =
      manifold.getMapCell(belowCoord)?.acceptBeam(manifold, belowCoord) ?? 1;
    return this.#timelines;
  }

  toString(): string {
    return this.#hasBeam ? "|" : ".";
  }
}

class Splitter implements ManifoldCell {
  readonly hasBeam = false;
  #hasSplit = false;
  #timelines = 0;

  get hasSplit(): boolean {
    return this.#hasSplit;
  }

  acceptBeam(manifold: Manifold, coord: Coordinate): number {
    if (this.#hasSplit) {
      return this.#timelines;
    }

    this.#hasSplit = true;
    this.#timelines = SURROUNDING_COORDS.map((neighbour) =>
      coord.add(neighbour)
    )
      .map((coord) => {
        const neighbour = manifold.getMapCell(coord);
        if (neighbour && !(neighbour instanceof Splitter)) {
          return neighbour.acceptBeam(manifold, coord);
        }
        return 0;
      })
      .reduce((a, b) => a + b, 0);
    return this.#timelines;
  }

  toString(): string {
    return "^";
  }
}

class Manifold extends Map<ManifoldCell> {
  readonly #start: Coordinate;

  constructor(map: ManifoldCell[][], start: Coordinate) {
    super(map);
    this.#start = start;
  }

  static fromInput(input: string): Manifold {
    let start: Space;
    return new Manifold(
      input.split("\n").map((row, y) =>
        row.split("").map((cell, x) => {
          switch (cell) {
            case ".":
              return new Space();
            case "^":
              return new Splitter();
            case "S":
              start = new Coordinate(x, y);
              return new Space();
          }
        })
      ),
      start
    );
  }

  acceptBeam(): number {
    return this.getMapCell(this.#start).acceptBeam(this, this.#start);
  }

  get splits(): number {
    return this.reduce((total, cell) => total + (cell.hasSplit ? 1 : 0), 0);
  }
}
