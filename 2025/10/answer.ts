import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = async ([input]) => {
  const machines = input.split("\n").map(Machine.fromLine);

  const fewestPressesForIndicators = machines.reduce(
    (total, machine) => total + machine.fewestPressesForIndicator,
    0
  );

  const fewestPressesForJoltages = machines.reduce(
    (total, machine) => total + machine.fewestPressesForJoltage,
    0
  );

  return [fewestPressesForIndicators, fewestPressesForJoltages];
};

interface IndicatorSearch {
  button: Button;
  indicator: Indicator;
}

interface JoltageSearch {
  button: Button;
  joltage: Joltage;
}

class Machine {
  readonly #buttons: Button[];
  readonly #goalIndicator: Indicator;
  readonly #goalJoltage: Joltage;

  constructor(
    buttons: Button[],
    goalIndicator: Indicator,
    goalJoltage: Joltage
  ) {
    this.#buttons = buttons;
    this.#goalIndicator = goalIndicator;
    this.#goalJoltage = goalJoltage;
  }

  static fromLine(line: string) {
    const parts = line.split(" ");
    const buttons = parts.slice(1, -1).map(Button.fromString);
    const goalIndicator = Indicator.fromString(parts.at(0));
    const goalJoltage = Joltage.fromString(parts.at(-1));
    return new Machine(buttons, goalIndicator, goalJoltage);
  }

  toString() {
    return (
      "Machine(" +
      [...this.#buttons, this.#goalIndicator, this.#goalJoltage]
        .map((s) => s.toString())
        .join(",") +
      ")"
    );
  }

  get fewestPressesForIndicator(): number {
    const search: IndicatorSearch[][] = [
      [{ indicator: this.#goalIndicator.asStartState() }]
    ];

    for (let buttonsPressed = 1; true; buttonsPressed++) {
      const prevSearch = search[buttonsPressed - 1];
      const nextSearch = (search[buttonsPressed] = []);
      for (const {
        button: prevButton,
        indicator: prevIndicator
      } of prevSearch) {
        for (const button of this.#buttons) {
          if (button === prevButton) {
            continue;
          }

          const indicator = button.applyToIndicator(prevIndicator);
          if (!indicator.diff(this.#goalIndicator)) {
            return buttonsPressed;
          }

          nextSearch.push({ button, indicator });
        }
      }
    }
  }

  get fewestPressesForJoltage(): number {
    const search: JoltageSearch[][] = [
      [{ joltage: this.#goalJoltage.asStartState() }]
    ];

    for (let buttonsPressed = 1; true; buttonsPressed++) {
      const prevSearch = search[buttonsPressed - 1];
      const nextSearch = (search[buttonsPressed] = []);
      for (const { button: prevButton, joltage: prevJoltage } of prevSearch) {
        for (const button of this.#buttons) {
          const joltage = button.applyToJoltage(prevJoltage);
          const diff = joltage.diff(this.#goalJoltage);

          if (!diff) {
            return buttonsPressed;
          }

          if (diff !== Infinity) {
            nextSearch.push({ button, indicator });
          }
        }
      }
    }
  }
}

class Button {
  readonly #positions: number[];

  constructor(positions: number[]) {
    this.#positions = positions;
  }

  static fromString(str: string): Button {
    const positions = str
      // assuming it starts with "(" and ends with ")"
      .slice(1, -1)
      .split(",")
      .map(Maths.parseInt);
    return new Button(positions);
  }

  applyToIndicator(indicator: Indicator): Indicator {
    return indicator.toggleIndicator(this.#positions);
  }

  applyToJoltage(joltage: Joltage): Joltage {
    return joltage.addJoltage(this.#positions);
  }

  toString() {
    return "Button((" + this.#positions.join(",") + "))";
  }
}

class Indicator {
  readonly #state: boolean[];

  constructor(state: boolean[]) {
    this.#state = state;
  }

  static fromString(str: string): Indicator {
    const state = str
      // assuming it starts with "(" and ends with ")"
      .slice(1, -1)
      .split("")
      .map((v) => v === "#");

    return new Indicator(state);
  }

  asStartState(): Indicator {
    return new Indicator(
      Array.from({ length: this.#state.length }, () => false)
    );
  }

  toggleIndicator(positions: number[]) {
    return new Indicator(
      this.#state.map((light, index) =>
        positions.includes(index) ? !light : light
      )
    );
  }

  diff(other: Indicator): number {
    return this.#state.reduce(
      (diff, light, index) =>
        diff + (other.#state[index] === light ? 0 : light === true ? 2 : 1),
      0
    );
  }

  toString() {
    return (
      "Indicator([" +
      this.#state.map((light) => (light ? "#" : ".")).join("") +
      "])"
    );
  }
}

class Joltage {
  readonly #state: number[];

  constructor(state: number[]) {
    this.#state = state;
  }

  static fromString(str: string): Joltage {
    const state = str
      // assuming it starts with "{" and ends with "}"
      .slice(1, -1)
      .split(",")
      .map(Maths.parseInt);
    return new Joltage(state);
  }

  asStartState(): Joltage {
    return new Joltage(Array.from({ length: this.#state.length }), () => 0);
  }

  addJoltage(positions: []): Joltage {
    const newState = this.#state.map((jolt, index) =>
      positions.includes(index) ? ++jolt : jolt
    );
    return new Joltage(newState);
  }

  diff(other: Joltage): number {
    return this.#state.reduce((diff, jolt, index) => {
      const otherJolt = other.#state[index];
      return diff + (otherJolt >= jolt ? otherJolt - jolt : Infinity);
    }, 0);
  }

  toString() {
    return "Joltage({" + this.#state.join(",") + "})";
  }
}
