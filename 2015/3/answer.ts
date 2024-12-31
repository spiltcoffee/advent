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

function visitedHouses(directions: Direction[]): Set<string> {
  const visited = new Set<string>([Coordinate.ORIGIN.toString()]);

  directions.reduce((coordinate, direction) => {
    coordinate = coordinate.add(Coordinate.fromDirection(direction));
    visited.add(coordinate.toString());
    return coordinate;
  }, Coordinate.ORIGIN);

  return visited;
}

export const answer: AnswerFunction = ([input]) => {
  const directions = input.split("").map(directionFromChar);

  const part1Visited = visitedHouses(directions).size;

  const [santaDirections, robotDirections] = directions.reduce(
    ([santa, robot], direction, index) => {
      if (index % 2 === 0) {
        santa.push(direction);
      } else {
        robot.push(direction);
      }
      return [santa, robot];
    },
    [[], []] as [Direction[], Direction[]]
  );

  const part2Visited = visitedHouses(santaDirections).union(
    visitedHouses(robotDirections)
  ).size;

  return [part1Visited, part2Visited];
};
