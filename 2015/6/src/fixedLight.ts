import { Light } from "./light.ts";

export class FixedLight implements Light<boolean> {
  #state = false;

  on(): void {
    this.#state = true;
  }

  off(): void {
    this.#state = false;
  }

  toggle(): void {
    this.#state = !this.#state;
  }

  get state(): boolean {
    return this.#state;
  }
}
