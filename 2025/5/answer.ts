import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const [idRangesInput, idsInput] = input.split("\n\n");
  const idRanges = idRangesInput
    .split("\n")
    .map(IdRange.fromLine)
    .sort((a, b) => a.compareTo(b));
  const ids = idsInput.split("\n").map(Maths.parseInt);

  const freshTotal = ids.filter((id) =>
    idRanges.find((idRange) => idRange.contains(id))
  ).length;

  const freshAll = idRanges
    .reduce((merged, idRange) => {
      if (!merged.length) {
        return [idRange];
      }

      const last = merged.at(-1);
      if (last.overlaps(idRange)) {
        const newIdRange = last.merge(idRange);
        return [...merged.slice(0, -1), newIdRange];
      }
      return [...merged, idRange];
    }, [])
    .reduce((all, idRange) => all + idRange.diff, 0);

  return [freshTotal, freshAll];
};

class IdRange {
  readonly #lo: number;
  readonly #hi: number;

  constructor(lo: number, hi: number) {
    this.#lo = lo;
    this.#hi = hi;
  }

  static fromLine(line: string) {
    const [lo, hi] = line.split("-").map(Maths.parseInt);
    return new IdRange(lo, hi);
  }

  contains(id: number): boolean {
    return this.#lo <= id && id <= this.#hi;
  }

  compareTo(other: IdRange) {
    return this.#lo - other.#lo || this.#hi - other.#hi;
  }

  toString() {
    return `${this.#lo}-${this.#hi}`;
  }

  // is this efficient?
  overlaps(other: IdRange) {
    return (
      this.contains(other.#lo) ||
      this.contains(other.#hi) ||
      other.contains(this.#lo) ||
      other.contains(this.#hi)
    );
  }

  merge(other: IdRange): IdRange {
    const lo = Math.min(this.#lo, other.#lo);
    const hi = Math.max(this.#hi, other.#hi);
    return new IdRange(lo, hi);
  }

  get diff() {
    return this.#hi - this.#lo + 1;
  }
}
