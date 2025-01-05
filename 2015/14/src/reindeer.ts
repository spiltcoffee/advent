import { Memoize } from "fast-typescript-memoize";
import { Maths } from "../../../common/maths.ts";

export class Reindeer {
  readonly #name: string;
  readonly #speed: number;
  readonly #moving: number;
  readonly #resting: number;

  private constructor(
    name: string,
    speed: number,
    moving: number,
    resting: number
  ) {
    this.#name = name;
    this.#speed = speed;
    this.#moving = moving;
    this.#resting = resting;
  }

  static fromInput(input: string): Reindeer {
    const parts = input.split(" ");
    const name = parts[0];
    const [speed, moving, resting] = [parts[3], parts[6], parts[13]].map(
      Maths.parseInt
    );

    return new Reindeer(name, speed, moving, resting);
  }

  get name(): string {
    return this.#name;
  }

  private get fullTime(): number {
    return this.#moving + this.#resting;
  }

  @Memoize()
  travel(time: string): number {
    return (
      (Math.floor(time / this.fullTime) * this.#moving +
        Math.min(time % this.fullTime, this.#moving)) *
      this.#speed
    );
  }
}
