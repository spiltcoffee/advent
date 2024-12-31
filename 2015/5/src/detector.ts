import { Memoize } from "fast-typescript-memoize";

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

  @Memoize()
  toString(): string {
    return this.#letters.join("");
  }

  private checkRule1(): boolean {
    return (
      this.#letters.filter((letter) => Detector.VOWELS.includes(letter))
        .length >= 3
    );
  }

  private checkRule2(): boolean {
    return this.#letters.some(
      (letter, index, array) => letter === array[index + 1]
    );
  }

  private checkRule3(): boolean {
    return this.#letters.every(
      (letter, index, array) =>
        !Detector.BANNED.includes(letter + array[index + 1])
    );
  }

  private checkRule4(): boolean {
    return this.#letters.some((letter, index, array) => {
      const nextLetter = array[index + 1];
      if (nextLetter === undefined) {
        return false;
      }

      const lettersToCheck = letter + nextLetter;

      if (
        this.toString().indexOf(lettersToCheck) !==
        this.toString().lastIndexOf(lettersToCheck)
      ) {
        if (letter !== nextLetter) {
          return true;
        } else {
          let currIndex = this.toString().indexOf(lettersToCheck);
          while (true) {
            const nextIndex = this.toString().indexOf(
              lettersToCheck,
              currIndex + 1
            );

            if (nextIndex === -1) {
              return true;
            }

            if (nextIndex - currIndex === 1) {
              return false;
            }

            currIndex = nextIndex;
          }
        }
      }
      return false;
    });
  }

  private checkRule5(): boolean {
    return this.#letters.some(
      (letter, index, array) => letter === array[index + 2]
    );
  }

  get isNice(): boolean {
    return this.checkRule1() && this.checkRule2() && this.checkRule3();
  }

  get isBetterNice(): boolean {
    return this.checkRule4() && this.checkRule5();
  }
}
