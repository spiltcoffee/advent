import { Memoize } from "fast-typescript-memoize";
import { Route } from "./route.ts";

export class City {
  readonly #name: string;
  readonly #routes = new Set<Route>();

  private constructor(name: string) {
    this.#name = name;
  }

  @Memoize()
  static fromName(name: string): City {
    return new City(name);
  }

  get name(): string {
    return this.#name;
  }

  addRoute(route: Route) {
    this.#routes.add(route);
  }

  @Memoize()
  get neighbours(): City[] {
    return this.#routes
      .values()
      .map((route) => route.getOtherCity(this))
      .toArray();
  }
}
