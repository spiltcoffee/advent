import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const points = input
    .split("\n")
    .map(
      (line) =>
        new Coordinate(
          ...(<[number, number]>line.split(",").map(Maths.parseInt))
        )
    );

  const rectangles = points
    .slice(0, -1)
    .flatMap((point, index) =>
      points
        .slice(index + 1)
        .map((otherPoint) => new Rectangle(point, otherPoint))
    );

  const largestRectangle = rectangles
    .sort(({ area: a }, { area: b }) => b - a)
    .at(0);

  return [largestRectangle.area];
};

class Rectangle {
  readonly #pointA: Coordinate;
  readonly #pointB: Coordinate;
  readonly #area: number;

  constructor(pointA: Coordinate, pointB: Coordinate) {
    this.#pointA = pointA;
    this.#pointB = pointB;
    this.#area =
      Math.abs(pointA.x - pointB.x + 1) * Math.abs(pointA.y - pointB.y + 1);
  }

  get area() {
    return this.#area;
  }

  get points(): [Coordinate, Coordinate] {
    return [this.#pointA, this.#pointB];
  }
}
