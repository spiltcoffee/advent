type PinNumber = 0 | 1 | 2 | 3 | 4 | 5;
type Pins = [PinNumber, PinNumber, PinNumber, PinNumber, PinNumber];

export class Mechanism {
  readonly #pins: Pins;

  private constructor(pins: Pins) {
    this.#pins = pins;
  }

  static fromLines(lines: string[]): Mechanism {
    const pins: Pins = [0, 0, 0, 0, 0];

    lines.slice(1).forEach((line) =>
      line.split("").forEach((cell, index) => {
        if (cell === "#") {
          pins[index]++;
        }
      })
    );

    return new Mechanism(pins);
  }

  fitsWith(other: Mechanism): boolean {
    return this.#pins.every((pin, index) => pin + other.#pins[index] < 6);
  }

  toString(): string {
    return `Mechanism[${this.#pins}]`;
  }
}
