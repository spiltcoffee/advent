import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Direction } from "../../common/direction.ts";
import { Map } from "../../common/map.ts";

export const answer: AnswerFunction = ([input]) => {
  const paperfloor = Paperfloor.fromInput(input);
  return [paperfloor.accessibleRolls, paperfloor.removableRolls];
};

const CHECK_NEIGHBOURS = [
  Direction.EAST,
  Direction.SOUTH_EAST,
  Direction.SOUTH,
  Direction.SOUTH_WEST
].map(Coordinate.fromDirection);

const ALL_NEIGHBOURS = Object.values(Direction).map(Coordinate.fromDirection);

interface Cell {
  empty: boolean;
  nearby: number;
  accessible: boolean;
}

class EmptyCellClass implements Cell {
  get empty(): boolean {
    return true;
  }

  set nearby(value: number) {
    //do nothing
  }

  get accessible(): boolean {
    return false;
  }
}
const EmptyCell = new EmptyCellClass();

class PaperCell implements Cell {
  #nearby: number = 0;

  get empty(): boolean {
    return false;
  }

  get nearby(): number {
    return this.#nearby;
  }

  set nearby(value: number) {
    this.#nearby = value;
  }

  get accessible(): boolean {
    return this.#nearby < 4;
  }
}

class Paperfloor extends Map<Cell> {
  static fromInput(input: string) {
    const paperfloor = new Paperfloor(
      input.split("\n").map((row) =>
        row.split("").map((cell) => {
          switch (cell) {
            case ".":
              return EmptyCell;
            case "@":
              return new PaperCell();
            default:
              throw new Error("unknown cell type");
          }
        })
      )
    );

    paperfloor.forEach((cell, coord) => {
      paperfloor
        .getMapCells(CHECK_NEIGHBOURS.map((other) => coord.add(other)))
        .forEach((otherCell) => {
          if (!cell.empty) {
            otherCell.nearby++;
          }
          if (!otherCell.empty) {
            cell.nearby++;
          }
        });
    });

    return paperfloor;
  }

  get accessibleRolls(): number {
    return this.reduce(
      (accessible, cell) => accessible + (cell.accessible ? 1 : 0),
      0
    );
  }

  removeRolls(): void {
    this.reduce((coords, cell, coord) => {
      if (cell.accessible) {
        coords.push(coord);
      }
      return coords;
    }, []).forEach((coord) => {
      this.getMapCells(ALL_NEIGHBOURS.map((other) => coord.add(other))).forEach(
        (otherCell) => otherCell.nearby--
      );
      this.setMapCell(coord, EmptyCell);
    });
  }

  get removableRolls(): number {
    const removableRolls = this.accessibleRolls;
    if (removableRolls) {
      this.removeRolls();
      return removableRolls + this.removableRolls;
    }
    return 0;
  }
}
