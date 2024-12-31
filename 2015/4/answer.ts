import { AnswerFunction } from "../../answer.ts";
import crypto from "crypto";

class MD5 {
  static readonly #hash = crypto.createHash("md5");
  static hash(input: string): string {
    return this.#hash.copy().update(input).digest("hex");
  }
}

export const answer: AnswerFunction = ([input]) => {
  let hash = "";
  let num = 0;
  do {
    num++;
    hash = MD5.hash(`${input}${num}`);
  } while (!hash.startsWith("00000"));

  return [num];
};
