import { Memoize } from "fast-typescript-memoize";
import { Maths } from "../../../common/maths.ts";
import { City } from "./city.ts";

export class Route {
  readonly #cities: [City, City];
  readonly #distance: number;

  private constructor(cities: [City, City], distance: number) {
    this.#cities = cities;
    this.#cities.forEach((city) => city.addRoute(this));
    this.#distance = distance;
  }

  static fromLine(line: string): Route {
    const [city1, , city2, , distanceStr] = line.split(" ");
    const cities = [City.fromName(city1), City.fromName(city2)] as [City, City];
    const distance = Maths.parseInt(distanceStr);
    return new Route(cities, distance);
  }

  get distance(): number {
    return this.#distance;
  }

  @Memoize()
  getOtherCity(currentCity: City) {
    if (!this.#cities.includes(currentCity)) {
      console.log(`Unknown city "${currentCity.name}" for route.`);
    }

    return this.#cities.find((city) => city !== currentCity);
  }

  @Memoize()
  get cities(): Set<City> {
    return new Set(this.#cities);
  }
}
