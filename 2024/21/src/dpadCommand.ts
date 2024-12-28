import { Memoize } from "fast-typescript-memoize";
import { Coordinate } from "../../../common/coordinate.ts";
import range from "lodash.range";

export enum DpadCommand {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
  PRESS = "A"
}

const DPAD: Record<DpadCommand, Coordinate> = {
  // blank spot (0,0)
  [DpadCommand.UP]: new Coordinate(1, 0),
  [DpadCommand.PRESS]: new Coordinate(2, 0),

  [DpadCommand.LEFT]: new Coordinate(0, 1),
  [DpadCommand.DOWN]: new Coordinate(1, 1),
  [DpadCommand.RIGHT]: new Coordinate(2, 1)
};

export class DpadCommandBuilder {
  @Memoize((start, end) => start + end)
  static build(start: DpadCommand, end: DpadCommand): DpadCommand[] {
    const { x, y } = DPAD[end].subtract(DPAD[start]);

    const commands = [];

    const leri = range(Math.abs(x)).map(() =>
      x > 0 ? DpadCommand.RIGHT : DpadCommand.LEFT
    );
    const updo = range(Math.abs(y)).map(() =>
      y > 0 ? DpadCommand.DOWN : DpadCommand.UP
    );

    if (!updo.length) {
      commands.push(...leri);
    } else if (!leri.length) {
      commands.push(...updo);
    } else if (end === DpadCommand.LEFT) {
      commands.push(...updo, ...leri); //avoid corner
    } else if (start === DpadCommand.LEFT) {
      commands.push(...leri, ...updo); //avoid corner
    } else if (leri[0] === DpadCommand.LEFT) {
      commands.push(...leri, ...updo);
    } else {
      commands.push(...updo, ...leri);
    }

    return [...commands, DpadCommand.PRESS];
  }
}
