import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const banks = input.split("\n").map(Bank.fromLine);
  const totalJoltage2Batteries = banks.reduce(
    (total, bank) => total + bank.getHighestJoltage(2),
    0
  );
  const totalJoltage12Batteries = banks.reduce(
    (total, bank) => total + bank.getHighestJoltage(12),
    0
  );
  return [totalJoltage2Batteries, totalJoltage12Batteries];
};

class Bank {
  #batteries: number[];

  constructor(batteries: number[]) {
    this.#batteries = batteries;
  }

  static fromLine(line: string): Bank {
    return new Bank(line.split("").map(Maths.parseInt));
  }

  getHighestJoltage(batteryCount: number): number {
    const numbers: number[] = [];
    let startIndex = 0;
    for (let i = batteryCount - 1; i >= 0; i--) {
      numbers.push(
        this.#batteries
          .slice(startIndex, i ? -i : undefined)
          .toSorted()
          .at(-1)
      );
      startIndex = this.#batteries.indexOf(numbers.at(-1), startIndex) + 1;
    }
    const joltage = Maths.parseInt(
      numbers.reduce((str, battery) => `${str}${battery}`, "")
    );
    return joltage;
  }
}
