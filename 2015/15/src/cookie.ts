import { Ingredient } from "./ingredient.ts";
import { Stat, StatSansCalories } from "./stat.ts";

export class Cookie {
  readonly #ingredients: Ingredient[];

  private constructor(ingredients: Ingredient[]) {
    this.#ingredients = ingredients;
  }

  static fromInput(input: string): Cookie {
    return new Cookie(input.split("\n").map(Ingredient.fromLine));
  }

  buildBestCookie(): Map<StatSansCalories, number> {
    const stats = new Map<StatSansCalories, number>();

    return stats;
  }
}
