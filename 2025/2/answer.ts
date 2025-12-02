import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input]) => {
  const idRanges = input.split(",").flatMap(IdRange.fromString);

  const onlyHalfTotal = Maths.sum(
    idRanges.flatMap((idRange) => idRange.findInvalidIds([2]))
  );

  const allTotal = Maths.sum(
    idRanges.flatMap((idRange) => idRange.findInvalidIds())
  );

  return [onlyHalfTotal, allTotal];
};

class IdRange {
  readonly #lo: number;
  readonly #hi: number;
  readonly #length: number;

  constructor(lo: number, hi: number) {
    this.#lo = lo;
    this.#hi = hi;
    this.#length = hi.toString().length;
  }

  static fromString(range: string): IdRange[] {
    const [lo, hi] = range.split("-").map(Maths.parseInt);
    if (lo.toString().length === hi.toString().length) {
      return [new IdRange(lo, hi)];
    }

    const split = 10 ** lo.toString().length;

    return [new IdRange(lo, split - 1), new IdRange(split, hi)];
  }

  findInvalidIds(validFactors: number[] = []): number[] {
    return [
      ...this.findFactors(this.#length)
        .filter(
          ([chunks]) =>
            chunks !== 1 &&
            (!validFactors.length || validFactors.includes(chunks))
        )
        .reduce((all, [chunks, size]) => {
          const [loLeft, ...loRights] = this.chunkNumber(this.#lo, size);
          const lo =
            loLeft +
            (loLeft < (loRights.find((loRight) => loLeft !== loRight) ?? loLeft)
              ? 1
              : 0);

          const [hiLeft, ...hiRights] = this.chunkNumber(this.#hi, size);
          const hi =
            hiLeft +
            (hiLeft > (hiRights.find((hiRight) => hiLeft !== hiRight) ?? hiLeft)
              ? -1
              : 0);

          if (loLeft <= hiLeft) {
            const range = Maths.rangeClosed(lo, hi).map((idPart) =>
              Maths.parseInt(idPart.toString().repeat(chunks))
            );
            range.forEach((id) => all.add(id));
          }

          return all;
        }, new Set<number>())
    ];
  }

  findFactors(num: number): [number, number][] {
    const factors: [number, number][] = [];
    for (let denom = 1; denom <= num; denom++) {
      if (num % denom === 0) {
        factors.push([denom, num / denom]);
      }
    }
    return factors;
  }

  chunkNumber(num: string | number, size: number): number {
    num = num.toString();
    if (num.length % size !== 0) {
      throw new Error(
        `Cannot split ${num} into chunks of size ${chunkSize} evenly`
      );
    }
    const chunks: number[] = [];
    for (let i = 0; i < num.length; i += size) {
      chunks.push(num.slice(i, i + size));
    }
    return chunks.map(Maths.parseInt);
  }
}
