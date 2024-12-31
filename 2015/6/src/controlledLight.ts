import { Light } from "./light.ts";

export class ControlledLight implements Light<number> {
  #state = 0;

  on(): void {
    this.#state++;
  }

  off(): void {
    this.#state = Math.max(0, this.#state - 1);
  }

  toggle(): void {
    this.#state += 2;
  }

  get state(): number {
    return this.#state;
  }
}
