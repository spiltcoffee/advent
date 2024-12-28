import { Memoize } from "fast-typescript-memoize";
import { DpadCommand, DpadCommandBuilder } from "./dpadCommand.ts";
import { KeypadCommand, KeypadCommandBuilder } from "./keypadCommand.ts";

type Command = DpadCommand | KeypadCommand;

export class RobotInput {
  readonly start: Command;
  readonly end: Command;
  readonly #transformTo: DpadCommand[];
  readonly #commandCount: number[];

  private constructor(
    start: Command,
    end: Command,
    transformTo: DpadCommand[]
  ) {
    this.start = start;
    this.end = end;
    this.#transformTo = transformTo;
    this.#commandCount = [1, transformTo.length];
  }

  @Memoize((start, end) => start + end)
  private static fromDpadInput(start: Command, end: Command) {
    const transformTo = DpadCommandBuilder.build(
      start as DpadCommand,
      end as DpadCommand
    );
    return new RobotInput(start, end, transformTo);
  }

  @Memoize((start, end) => start + end)
  private static fromKeypadInput(start: Command, end: Command) {
    const transformTo = KeypadCommandBuilder.build(
      start as KeypadCommand,
      end as KeypadCommand
    );
    return new RobotInput(start, end, transformTo);
  }

  private getInputAtDepth(depth: number): number {
    this.#commandCount[depth] ||= this.#transformTo
      .map((end, index, array) => {
        const start = array[index - 1] || DpadCommand.PRESS;
        return RobotInput.fromDpadInput(start, end);
      })
      .reduce((total, input) => total + input.getInputAtDepth(depth - 1), 0);

    return this.#commandCount[depth];
  }

  static getComplexity(codes: string[], depth: number): number {
    return codes.reduce((total, code) => {
      const sequenceLength = (code.split("") as KeypadCommand[]).reduce(
        (total, end, index, array) => {
          const start = array[index - 1] || KeypadCommand.PRESS;
          const robotInput = RobotInput.fromKeypadInput(start, end);
          return total + robotInput.getInputAtDepth(depth);
        },
        0
      );
      return total + Number.parseInt(code, 10) * sequenceLength;
    }, 0);
  }
}
