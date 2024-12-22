import range from "lodash.range";
import { Coordinate } from "../../../common/coordinate.ts";
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

const DPAD_TO_DPAD: Record<
  DpadCommand,
  Record<DpadCommand, Array<DpadCommand>>
> = {
  A: {
    A: [],
    "^": [DpadCommand.LEFT],
    ">": [DpadCommand.DOWN],
    v: [DpadCommand.LEFT, DpadCommand.DOWN],
    "<": [DpadCommand.DOWN, DpadCommand.LEFT, DpadCommand.LEFT]
  },
  "^": {
    "^": [],
    A: [DpadCommand.RIGHT],
    v: [DpadCommand.DOWN],
    ">": [DpadCommand.RIGHT, DpadCommand.DOWN],
    "<": [DpadCommand.DOWN, DpadCommand.LEFT]
  },
  ">": {
    ">": [],
    A: [DpadCommand.UP],
    v: [DpadCommand.LEFT],
    "^": [DpadCommand.LEFT, DpadCommand.UP],
    "<": [DpadCommand.LEFT, DpadCommand.LEFT]
  },
  v: {
    v: [],
    "^": [DpadCommand.UP],
    ">": [DpadCommand.RIGHT],
    "<": [DpadCommand.LEFT],
    A: [DpadCommand.RIGHT, DpadCommand.UP]
  },
  "<": {
    "<": [],
    v: [DpadCommand.RIGHT],
    ">": [DpadCommand.RIGHT, DpadCommand.RIGHT],
    "^": [DpadCommand.RIGHT, DpadCommand.UP],
    A: [DpadCommand.RIGHT, DpadCommand.RIGHT, DpadCommand.UP]
  }
};

export class RobotKeypad {
  readonly #depth: number;

  constructor(depth: number) {
    this.#depth = depth;
  }

  private codeToKeypad(code: string): KeypadCommand[] {
    return code.split("") as KeypadCommand[];
  }

  // this function is fucked....
  @Memoize((start, end) => start + end)
  private buildKeypadCommands(
    start: KeypadCommand,
    end: KeypadCommand
  ): DpadCommand[] {
    const { x, y } = KEYPAD[end].subtract(KEYPAD[start]);

    let commands = [
      ...range(Math.abs(x)).map(() =>
        x > 0 ? DpadCommand.RIGHT : DpadCommand.LEFT
      ),
      ...range(Math.abs(y)).map(() =>
        y > 0 ? DpadCommand.DOWN : DpadCommand.UP
      )
    ];

    if (
      ([KeypadCommand.ZERO, KeypadCommand.PRESS].includes(start) &&
        [KeypadCommand.ONE, KeypadCommand.FOUR, KeypadCommand.SEVEN].includes(
          end
        )) ||
      (x === 1 &&
        y >= 1 &&
        ![KeypadCommand.ONE, KeypadCommand.FOUR, KeypadCommand.SEVEN].includes(
          start
        ))
    ) {
      commands.reverse();
    }

    return [...commands, DpadCommand.PRESS];
  }

  private keypadToDpad(code: KeypadCommand[]): DpadCommand[] {
    return code.reduce((commands, key, index, array) => {
      const nextCommands = this.buildKeypadCommands(
        array[index - 1] ?? KeypadCommand.PRESS,
        key
      );
      return commands.concat(nextCommands);
    }, []);
  }

  @Memoize((start, end) => start + end)
  private buildDpadCommands(
    start: DpadCommand,
    end: DpadCommand
  ): DpadCommand[] {
    return [...DPAD_TO_DPAD[start][end], DpadCommand.PRESS];
  }

  private dpadToDpad(commands: DpadCommand[]): DpadCommand[] {
    return commands.reduce((commands, key, index, array) => {
      const nextCommands = this.buildDpadCommands(
        array[index - 1] ?? DpadCommand.PRESS,
        key
      );

      return commands.concat(nextCommands);
    }, []);
  }

  private codeToDpad(code: string, depth: number = this.#depth): DpadCommand[] {
    const result = depth
      ? this.dpadToDpad(this.codeToDpad(code, depth - 1))
      : this.keypadToDpad(this.codeToKeypad(code));
    return result;
  }

  getComplexity(code: string): number {
    const sequence = this.codeToDpad(code);
    return Number.parseInt(code, 10) * sequence.length;
  }
}
