import { Memoize } from "fast-typescript-memoize";
import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = async ([input]) => {
  const machines = input.split("\n").map(Machine.fromLine);

  console.log(machines.length, "machines");
  const fewestPresses = await Promise.all(
    machines.map((machine, index) => {
      try {
        return machine.getFewestPresses();
      } finally {
        console.log(index + 1, "processed");
      }
    })
  );

  const fewestTotalPresses = fewestPresses.reduce((a, b) => a + b);
  return [fewestTotalPresses];
};

class Machine {
  readonly #goalIndicator: Indicator;
  readonly #buttons: Button[];
  readonly #joltages: Joltages;

  constructor(goalIndicator: Indicator, buttons: Button[], joltages: Joltages) {
    this.#goalIndicator = goalIndicator;
    this.#buttons = buttons;
    this.#joltages = joltages;
  }

  static fromLine(line: string) {
    const parts = line.split(" ");
    const goalIndicator = Indicator.fromString(parts.at(0));
    const buttons = parts.slice(1, -1).map(Button.fromString);
    const joltages = Joltages.fromString(parts.at(-1));
    return new Machine(goalIndicator, buttons, joltages);
  }

  toString() {
    return (
      "Machine(" +
      [this.#goalIndicator, ...this.#buttons, this.#joltages]
        .map((s) => s.toString())
        .join(",") +
      ")"
    );
  }

  @Memoize()
  async getFewestPresses() {
    const startIndicator = this.#goalIndicator.asStartState();
    const search = this.#buttons.map((button) => {
      const indicator = button.applyTo(startIndicator);
      const diff = indicator.diff(this.#goalIndicator);
      return { diff, indicator, buttonsPressed: [button] };
    });

    function sort() {
      search.sort(
        (
          { buttonsPressed: { length: aButtons }, diff: aDiff },
          { buttonsPressed: { length: bButtons }, diff: bDiff }
        ) => aButtons - bButtons || aDiff - bDiff
      );
    }

    sort();

    while (search.at(0).diff) {
      const { indicator: prevIndicator, buttonsPressed } = search.shift();
      search.push(
        ...this.#buttons.map((button) => {
          const indicator = button.applyTo(prevIndicator);
          const diff = indicator.diff(this.#goalIndicator);
          return {
            diff,
            indicator,
            buttonsPressed: [...buttonsPressed, button]
          };
        })
      );
      sort();
      // console.log(
      //   search.map(({ diff, indicator, buttonsPressed }) => ({
      //     diff,
      //     indicator: indicator.toString(),
      //     buttonsPressed: buttonsPressed.map((s) => s.toString())
      //   }))
      // );
    }
    return search.at(0).buttonsPressed.length;
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

  toggleIndicators(positions: number[]) {
    const newState = this.#state.map((light, index) =>
      positions.includes(index) ? !light : light
    );
    return new Indicator(newState);
  }

  equals(other: Indicator): boolean {
    return this.#state.every((light, index) => other.#state[index] == light);
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

  applyTo(indicator: Indicator): Indicator {
    return indicator.toggleIndicators(this.#positions);
  }

  toString() {
    return "Button(" + this.#positions.join(",") + ")";
  }
}

class Joltages {
  readonly #joltages: number[];

  constructor(joltages: number[]) {
    this.#joltages = joltages;
  }

  static fromString(str: string): Joltages {
    const joltages = str
      // assuming it starts with "{" and ends with "}"
      .slice(1, -1)
      .split(",")
      .map(Maths.parseInt);
    return new Joltages(joltages);
  }

  toString() {
    return "Joltages(" + this.#joltages.join(",") + ")";
  }
}
