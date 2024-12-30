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

  static compAsc(a: number, b: number) {
    return a - b;
  }

  static compDesc(a: number, b: number) {
    return b - a;
  }
}
