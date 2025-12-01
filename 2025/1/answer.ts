import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const dial = input
    .split("\n")
    .map(DialTurn.ofLine)
    .reduce((dial, turn) => dial.apply(turn), new Dial());

  return [dial.landed, dial.passed];
};

class DialTurn {
  readonly amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  static ofLine(line: string) {
    const [dirStr, ...amtStr] = line.split("");
    const amount =
      Number.parseInt(amtStr.join(""), 10) * (dirStr === "R" ? 1 : -1);
    return new DialTurn(amount);
  }
}

class Dial {
  #position = 50;
  #landed = 0;
  #passed = 0;

  apply(turn: DialTurn) {
    this.#position += turn.amount;

    if (this.#position > 99) {
      while (this.#position > 99) {
        this.#passed++;
        this.#position -= 100;
      }
    } else if (this.#position < 0) {
      while (this.#position < 0) {
        this.#passed++;
        this.#position += 100;
      }
    }

    if (this.#position === 0) {
      this.#landed++;
    }

    return this;
  }

  get landed() {
    return this.#landed;
  }

  get passed() {
    return this.#passed;
  }
}
