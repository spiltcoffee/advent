import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const changes = input.split("\n").map(Maths.toNumber);
  const totalChange = Maths.sum(changes);

  let repeatedFreq: number;
  const visitedFreq = new Set<number>();
  let prevFreq: number = 0;
  let index = 0;

  while (true) {
    const nextFreq = prevFreq + changes[index];

    if (visitedFreq.has(nextFreq)) {
      repeatedFreq = nextFreq;
      break;
    } else {
      visitedFreq.add(nextFreq);
      prevFreq = nextFreq;
    }

    index++;
    if (index === changes.length) {
      index = 0;
    }
  }

  return [totalChange, repeatedFreq];
};
