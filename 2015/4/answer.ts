import { AnswerFunction } from "../../answer.ts";
import crypto from "crypto";

class MD5 {
  static readonly #hash = crypto.createHash("md5");
  static hash(input: string): string {
    return this.#hash.copy().update(input).digest("hex");
  }

  static saltOfHashStartingWith(input: string, startsWith: string) {
    let hash = "";
    let num = 0;
    do {
      num++;
      hash = MD5.hash(`${input}${num}`);
    } while (!hash.startsWith(startsWith));
    return num;
  }
}

export const answer: AnswerFunction = ([input]) => {
  const part1 = MD5.saltOfHashStartingWith(input, "00000");
  const part2 = MD5.saltOfHashStartingWith(input, "000000");

  return [part1, part2];
};
