export class Maths {
  private constructor() {}

  /**
   * Since JS's `%` operator is a *Remainder* operator, and not a *Modulo* operator,
   * need to manually implement it instead.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
   */
  static modulo(numerator: number, denominator: number) {
    return ((numerator % denominator) + denominator) % denominator;
  }

  static sum(nums: number[]): number;
  static sum(...nums: number[]): number;
  static sum(numsOrHead: number[] | number, ...restNums) {
    const nums =
      typeof numsOrHead === "number" ? [numsOrHead, ...restNums] : numsOrHead;
    return nums.reduce((total, num) => total + num, 0);
  }

  /** 2,1,3 -> 1,2,3 */
  static compAsc(a: number, b: number) {
    return a - b;
  }

  /** 2,1,3 -> 3,2,1 */
  static compDesc(a: number, b: number) {
    return b - a;
  }

  static parseInt(str: string): number {
    return Number.parseInt(str, 10);
  }

  static range(start: number, stop: number, step: number = 1) {
    return Array.from(
      { length: Math.ceil((stop - start) / step) },
      (_, i) => start + i * step
    );
  }

  static rangeClosed(start: number, stop: number, step: number = 1) {
    return this.range(start, stop + 1, step);
  }
}
