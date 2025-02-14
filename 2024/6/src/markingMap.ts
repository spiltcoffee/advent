import { Map } from "./map.ts";
import type { Coordinate } from "./coordinate.ts";
import type { Heading } from "./heading.ts";

export class MarkingMap extends Map<boolean> {
  static fromMap(map: Map<unknown>): MarkingMap {
    return new MarkingMap(map, false);
  }

  get count(): number {
    return this.getAllCells().filter(Boolean).length;
  }

  allMarkedBetween(heading: Heading, endCoord: Coordinate): boolean {
    while (!heading.coord.equals(endCoord)) {
      if (!this.getMapCell(heading.coord)) {
        return false;
      }
      heading = heading.move();
    }
    return true;
  }
}
