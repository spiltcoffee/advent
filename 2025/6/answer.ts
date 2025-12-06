import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const problems = MathsProblem.fromInput(input);

  const humanTotal = problems.reduce(
    (total, problem) => total + problem.humanResult,
    0
  );
  const cephalopodTotal = problems.reduce(
    (total, problem) => total + problem.cephalopodResult,
    0
  );

  return [humanTotal, cephalopodTotal];
};

class MathsProblem {
  #operator: (a: number, b: number) => number;
  #operatorStart: 0 | 1;
  #humanNumbers: number[];
  #cephalopodNumbers: number[];

  constructor(operator: string, numbers: string[]) {
    switch (operator.trim()) {
      case "+":
        this.#operator = (a, b) => a + b;
        this.#operatorStart = 0;
        break;
      case "*":
        this.#operator = (a, b) => a * b;
        this.#operatorStart = 1;
        break;
      default:
        throw new Error(`Unknown operator "${operator}"`);
    }
    this.#humanNumbers = numbers.map(Maths.parseInt);
    this.#cephalopodNumbers = numbers
      .reduce(
        (newNumbers, number) => {
          number.split("").forEach((part, index) => {
            newNumbers[index] ??= "";
            newNumbers[index] += part;
          });
          return newNumbers;
        },
        <string[]>[]
      )
      .map(Maths.parseInt);
  }

  static findNextIndexes(lines: string[], lastEndIndex: number) {
    const newStartIndex = lastEndIndex;
    let newEndIndex = newStartIndex + 1;
    while (
      lines.some((line) => ![" ", undefined].includes(line[newEndIndex]))
    ) {
      newEndIndex++;
    }

    return [newStartIndex, newEndIndex];
  }

  static fromInput(input: string): MathsProblem[] {
    const lines = input.split("\n");
    const maxLength = Math.max(...lines.map((line) => line.length));

    let [startIndex, endIndex] = this.findNextIndexes(lines, 0);

    const problems = [];

    while (endIndex <= maxLength) {
      const numbers = lines.map((line) => line.slice(startIndex, endIndex));
      const [operator] = numbers.splice(-1, 1);
      problems.push(new MathsProblem(operator, numbers));
      [startIndex, endIndex] = this.findNextIndexes(lines, endIndex + 1);
    }

    return problems;
  }

  get humanResult() {
    return this.#humanNumbers.reduce(this.#operator, this.#operatorStart);
  }

  get cephalopodResult() {
    return this.#cephalopodNumbers.reduce(this.#operator, this.#operatorStart);
  }
}
