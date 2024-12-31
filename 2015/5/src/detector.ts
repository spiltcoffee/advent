export class Detector {
  readonly #letters: string[];

  static readonly VOWELS = ["a", "e", "i", "o", "u"];
  static readonly BANNED = ["ab", "cd", "pq", "xy"];

  private constructor(letters: string[]) {
    this.#letters = letters;
  }

  static fromLine(line: string): Detector {
    return new Detector(line.split(""));
  }

  private checkRule1(): boolean {
    return (
      this.#letters.filter((letter) => Detector.VOWELS.includes(letter))
        .length >= 3
    );
  }

  private checkRule2(): boolean {
    return this.#letters.some(
      (letter, index, array) => letter === array[index - 1]
    );
  }

  private checkRule3(): boolean {
    return this.#letters.every(
      (letter, index, array) =>
        index === 0 || !Detector.BANNED.includes(array[index - 1] + letter)
    );
  }

  get isNice(): boolean {
    return this.checkRule1() && this.checkRule2() && this.checkRule3();
  }
}
