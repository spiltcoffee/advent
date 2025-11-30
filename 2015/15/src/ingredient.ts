import { Maths } from "../../../common/maths.ts";
import { Stat } from "./stat.ts";

export class Ingredient {
  readonly #name: string;
  readonly #capacity: number;
  readonly #durability: number;
  readonly #flavor: number;
  readonly #texture: number;
  readonly #calories: number;

  private constructor(
    name: string,
    capacity: number,
    durability: number,
    flavor: number,
    texture: number,
    calories: number
  ) {
    this.#name = name;
    this.#capacity = capacity;
    this.#durability = durability;
    this.#flavor = flavor;
    this.#texture = texture;
    this.#calories = calories;
  }

  static fromLine(line: string) {
    const [name, stats] = line.split(": ");
    const [capacity, durability, flavor, texture, calories] = line
      .split(", ")
      .map((stat) => stat.split(" ").at(1))
      .map(Maths.parseInt);

    return new Ingredient(
      name,
      capacity,
      durability,
      flavor,
      texture,
      calories
    );
  }

  get name(): string {
    return this.#name;
  }

  get [Stat.CAPACITY](): number {
    return this.#capacity;
  }

  get [Stat.DURABILITY](): number {
    return this.#durability;
  }

  get [Stat.FLAVOR](): number {
    return this.#flavor;
  }

  get [Stat.TEXTURE](): number {
    return this.#texture;
  }

  get [Stat.CALORIES](): number {
    return this.#calories;
  }
}
