import { AnswerFunction } from "../../answer.ts";
import { Mechanism } from "./src/mechanism.ts";

export const answer: AnswerFunction = ([input]) => {
  const mechanisms = input.split("\n\n");

  const locks: Mechanism[] = [];
  const keys: Mechanism[] = [];

  mechanisms.forEach((mechanism) => {
    const lines = mechanism.split("\n");

    if (lines[0] === "#####") {
      locks.push(Mechanism.fromLines(lines));
    } else {
      keys.push(Mechanism.fromLines(lines.reverse()));
    }
  });

  const uniquePairs = locks.flatMap((lock) =>
    keys.filter((key) => lock.fitsWith(key)).map((key) => ({ lock, key }))
  );

  return [uniquePairs.length.toString()];
};
