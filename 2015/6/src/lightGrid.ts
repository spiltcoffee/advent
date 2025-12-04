import { Map } from "../../../common/map.ts";
import { Maths } from "../../../common/maths.ts";
import { Instruction } from "./instruction.ts";
import { Light } from "./light.ts";

export class LightGrid<T extends Light> extends Map<T> {
  constructor(LightClass: new () => Light) {
    super(1000, 1000, () => new LightClass());
  }

  applyInstruction(instruction: Instruction) {
    this.forEach((light, coordinate) => {
      instruction.apply(light, coordinate);
    });
  }

  get lightsOn(): number {
    return Maths.sum(this.getAllCells().map(({ state }) => state));
  }
}
