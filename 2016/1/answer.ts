import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { CardinalDirection, Direction } from "../../common/direction.ts";

class Me {
  readonly coordinate: Coordinate;
  readonly direction: CardinalDirection;
  readonly path: Coordinate[];

  constructor(
    coordinate: Coordinate = Coordinate.ORIGIN,
    direction: CardinalDirection = Direction.NORTH,
    path: Coordinate[] = []
  ) {
    this.coordinate = coordinate;
    this.direction = direction;
    this.path = path;
  }

  get firstOverlap(): Coordinate {
    return this.path.find((step, index, path) => {
      return path.slice(0, index).some((prevStep) => prevStep.equals(step));
    });
  }
}

abstract class Step {
  private distance: number;

  constructor(distance: number) {
    this.distance = distance;
  }

  abstract rotate(direction: CardinalDirection): CardinalDirection;

  move(me: Me): Me {
    const newDirection = this.rotate(me.direction);
    const newCoordinate = me.coordinate.add(
      Coordinate.fromDirection(newDirection).multiply(this.distance)
    );
    const newPath = range(1, this.distance + 1).reduce((path, step) => {
      return [
        ...path,
        me.coordinate.add(Coordinate.fromDirection(newDirection).multiply(step))
      ];
    }, me.path);
    return new Me(newCoordinate, newDirection, newPath);
  }
}

class ClockwiseStep extends Step {
  rotate(direction: CardinalDirection): CardinalDirection {
    switch (direction) {
      case Direction.NORTH:
        return Direction.EAST;
      case Direction.EAST:
        return Direction.SOUTH;
      case Direction.SOUTH:
        return Direction.WEST;
      case Direction.WEST:
        return Direction.NORTH;
    }
  }
}

class AntiClockwiseStep extends Step {
  rotate(direction: CardinalDirection): CardinalDirection {
    switch (direction) {
      case Direction.NORTH:
        return Direction.WEST;
      case Direction.EAST:
        return Direction.NORTH;
      case Direction.SOUTH:
        return Direction.EAST;
      case Direction.WEST:
        return Direction.SOUTH;
    }
  }
}

export const answer: AnswerFunction = ([input]) => {
  const steps = input.split(", ").map((step) => {
    const [rotation, ...distance] = step.split("");
    switch (rotation) {
      case "R":
        return new ClockwiseStep(Number.parseInt(distance.join(""), 10));
      case "L":
        return new AntiClockwiseStep(Number.parseInt(distance.join(""), 10));
      default:
        throw new Error(`Unknown rotation "${rotation}"`);
    }
  });

  const finalMe = steps.reduce((me, step) => step.move(me), new Me());

  return [
    Coordinate.taxicabBetween(Coordinate.ORIGIN, finalMe.coordinate),
    Coordinate.taxicabBetween(Coordinate.ORIGIN, finalMe.firstOverlap)
  ];
};
