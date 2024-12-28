import range from "lodash.range";
import { Coordinate } from "../../../common/coordinate.ts";
import { DpadCommand } from "./dpadCommand.ts";
import { Memoize } from "fast-typescript-memoize";

export enum KeypadCommand {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  ZERO = "0",
  PRESS = "A"
}

const KEYPAD: Record<KeypadCommand, Coordinate> = {
  [KeypadCommand.SEVEN]: new Coordinate(0, 0),
  [KeypadCommand.EIGHT]: new Coordinate(1, 0),
  [KeypadCommand.NINE]: new Coordinate(2, 0),

  [KeypadCommand.FOUR]: new Coordinate(0, 1),
  [KeypadCommand.FIVE]: new Coordinate(1, 1),
  [KeypadCommand.SIX]: new Coordinate(2, 1),

  [KeypadCommand.ONE]: new Coordinate(0, 2),
  [KeypadCommand.TWO]: new Coordinate(1, 2),
  [KeypadCommand.THREE]: new Coordinate(2, 2),

  // blank spot (0,3)
  [KeypadCommand.ZERO]: new Coordinate(1, 3),
  [KeypadCommand.PRESS]: new Coordinate(2, 3)
};

const BOTTOM_ROW = [KeypadCommand.ZERO, KeypadCommand.PRESS];
const LEFT_COLUMN = [
  KeypadCommand.ONE,
  KeypadCommand.FOUR,
  KeypadCommand.SEVEN
];

export class KeypadCommandBuilder {
  // this function is fucked....
  @Memoize((start, end) => start + end)
  static build(start: KeypadCommand, end: KeypadCommand): DpadCommand[] {
    const { x, y } = KEYPAD[end].subtract(KEYPAD[start]);

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
    } else if (BOTTOM_ROW.includes(start) && LEFT_COLUMN.includes(end)) {
      commands.push(...updo, ...leri); //avoid corner
    } else if (LEFT_COLUMN.includes(start) && BOTTOM_ROW.includes(end)) {
      commands.push(...leri, ...updo); //avoid corner
    } else if (leri[0] === DpadCommand.LEFT) {
      commands.push(...leri, ...updo);
    } else {
      commands.push(...updo, ...leri);
    }

    return [...commands, DpadCommand.PRESS];
  }
}
