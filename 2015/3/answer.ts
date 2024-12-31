import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Direction } from "../../common/direction.ts";

function directionFromChar(char: string) {
  switch (char) {
    case "^":
      return Direction.NORTH;
    case ">":
      return Direction.EAST;
    case "v":
      return Direction.SOUTH;
    case "<":
      return Direction.WEST;
    default:
      throw new Error(`Unknown direction "${char}"`);
  }
}

export const answer: AnswerFunction = ([input]) => {
  const visited = new Set<string>([Coordinate.ORIGIN.toString()]);
  const directions = input.split("").map(directionFromChar);

  directions.reduce((coordinate, direction) => {
    coordinate = coordinate.add(Coordinate.fromDirection(direction));
    visited.add(coordinate.toString());
    return coordinate;
  }, Coordinate.ORIGIN);

  return [visited.size];
};
