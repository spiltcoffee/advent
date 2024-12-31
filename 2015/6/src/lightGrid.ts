import { Map } from "../../../common/map.ts";
import { Instruction } from "./instruction.ts";
import { Light } from "./light.ts";

export class LightGrid extends Map<Light> {
  constructor() {
    super(1000, 1000, () => new Light());
  }

  applyInstruction(instruction: Instruction) {
    this.forEachMapCell((light, coordinate) => {
      instruction.apply(light, coordinate);
    });
  }

  get lightsOnCount(): number {
    return this.getAllCells().filter(({ state }) => state).length;
  }
}
