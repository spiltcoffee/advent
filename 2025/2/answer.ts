import { Memoize } from "fast-typescript-memoize";
import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const invalidIdsTotal = Maths.sum(
    input
      .split(",")
      .map(IdRange.ofString)
      .flatMap((idRange) => idRange.normalise())
      .flatMap((idRange) => idRange.findInvalidIds())
  );
  return [invalidIdsTotal];
};

class IdRange {
  #original: IdRange;
  #lo: number;
  #hi: number;

  constructor(lo: number, hi: number) {
    this.#lo = lo;
    this.#hi = hi;
  }

  static ofString(range: string): IdRange {
    const [loStr, hiStr] = range.split("-");
    return new IdRange(Number.parseInt(loStr, 10), Number.parseInt(hiStr, 10));
  }

  @Memoize()
  get loLength(): number {
    return this.#lo.toString().length;
  }

  @Memoize()
  get hiLength(): number {
    return this.#hi.toString().length;
  }

  get isLopsided(): boolean {
    return this.loLength !== this.hiLength;
  }

  normalise(): IdRange[] {
    if (!this.isLopsided) {
      this.#original = this;
      return [this];
    }

    const split = 10 ** (this.hiLength - 1);

    const idRanges = [
      new IdRange(this.#lo, split - 1),
      new IdRange(split, this.#hi)
    ];

    idRanges.forEach((idRange) => (idRange.#original = this));

    return idRanges;
  }

  findInvalidIds(): number[] {
    if (!this.isLopsided && this.hiLength % 2 !== 0) {
      return [];
    }

    const halfway = this.loLength / 2;

    let loLeft = Number.parseInt(this.#lo.toString().slice(0, halfway), 10);
    const loRight = Number.parseInt(this.#lo.toString().slice(halfway), 10);
    let hiLeft = Number.parseInt(this.#hi.toString().slice(0, halfway), 10);
    const hiRight = Number.parseInt(this.#hi.toString().slice(halfway), 10);

    if (loLeft < loRight) {
      loLeft++;
    }

    if (hiLeft > hiRight) {
      hiLeft--;
    }

    if (loLeft > hiLeft) {
      return [];
    }

    return Maths.rangeClosed(loLeft, hiLeft).map((idHalf) =>
      Maths.parseInt(`${idHalf}${idHalf}`)
    );
  }
}
