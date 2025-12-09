import { AnswerFunction } from "../../answer.ts";
import { Maths } from "../../common/maths.ts";

export const answer: AnswerFunction = ([input, cableLimit]) => {
  const boxes = input.split("\n").map(JunctionBox.fromLine);

  const cables = boxes
    .flatMap((box, index) => {
      return boxes.slice(index + 1).map((otherBox) => box.cableTo(otherBox));
    })
    .sort((a, b) => a.compareTo(b));

  cables.slice(0, Maths.parseInt(cableLimit)).map((cable) => cable.connect());

  const circuits = [...new Set(boxes.map((box) => box.circuit))];

  const largestCircuitsSize = circuits
    .map((circuit) => circuit.size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b);

  const finalCable = cables
    .slice(Maths.parseInt(cableLimit))
    .find((cable) => cable.connect().size === boxes.length);

  return [largestCircuitsSize, finalCable.xLength];
};

class JunctionBox {
  readonly #x: number;
  readonly #y: number;
  readonly #z: number;
  #circuit: Circuit;

  constructor(x: number, y: number, z: number) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.#circuit = new Circuit(this);
  }

  static fromLine(line: string): JunctionBox {
    return new JunctionBox(...line.split(",").map(Maths.parseInt));
  }

  cableTo(other: JunctionBox): Cable {
    return new Cable(
      Math.sqrt(
        (this.#x - other.#x) ** 2 +
          (this.#y - other.#y) ** 2 +
          (this.#z - other.#z) ** 2
      ),
      this,
      other
    );
  }

  connectCircuit(other: JunctionBox): Circuit {
    return this.#circuit.mergeWith(other.#circuit);
  }

  get circuit(): Circuit {
    return this.#circuit;
  }

  set circuit(circuit: Circuit) {
    this.#circuit = circuit;
  }

  get x(): number {
    return this.#x;
  }

  toString(): string {
    return (
      "JunctionBox(" +
      [this.#x, this.#y, this.#z].map((s) => s.toString()).join(",") +
      ")"
    );
  }
}

class Cable {
  readonly #distance: number;
  readonly #boxA: JunctionBox;
  readonly #boxB: JunctionBox;

  constructor(distance: number, boxA: JunctionBox, boxB: JunctionBox) {
    this.#distance = distance;
    this.#boxA = boxA;
    this.#boxB = boxB;
  }

  compareTo(other: Cable): number {
    return this.#distance - other.#distance;
  }

  connect(): Circuit {
    return this.#boxA.connectCircuit(this.#boxB);
  }

  get xLength(): number {
    return this.#boxA.x * this.#boxB.x;
  }

  toString(): string {
    return (
      "Cable(" +
      [this.#distance, this.#boxA, this.#boxB]
        .map((s) => s.toString())
        .join(",") +
      ")"
    );
  }
}

class Circuit {
  private static nextId = 0;
  readonly #id: number;
  readonly #boxes: Set<JunctionBox>;

  constructor(...boxes: JunctionBox[]) {
    this.#id = Circuit.nextId++;
    this.#boxes = new Set(boxes);
    this.#boxes.forEach((box) => (box.circuit = this));
  }

  mergeWith(other: Circuit) {
    if (this === other) {
      return this;
    }
    return new Circuit(...this.#boxes, ...other.#boxes);
  }

  get size(): number {
    return this.#boxes.size;
  }

  toString(): string {
    return (
      "Circuit(" +
      [this.#id, ...this.#boxes].map((s) => s.toString()).join(",") +
      ")"
    );
  }
}
