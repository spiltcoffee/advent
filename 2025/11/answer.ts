import { Memoize } from "fast-typescript-memoize";
import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input1, input2]) => {
  const devices = Devices.fromInput(input1);
  const paths = devices.you.countPathsTo(devices.out);

  const stampedDevices = Devices.fromInput(input2 || input1);
  const stampedPaths = stampedDevices.svr.countPathsToWithStamps(
    stampedDevices.out,
    stampedDevices.stamps
  );

  return [paths, stampedPaths];
};

class Devices {
  readonly #devices: Record<string, Device>;

  constructor() {
    this.#devices = {};
  }

  static fromInput(input: string): Devices {
    const devices = new Devices();
    input.split("\n").forEach((line) => devices.parseLine(line));
    return devices;
  }

  parseLine(line: string): void {
    const [device, ...outputDevices] = line
      .split(": ")
      .flatMap((maybeNameOrNames, index) =>
        index
          ? maybeNameOrNames.split(" ").map((name) => this.fromName(name))
          : this.fromName(maybeNameOrNames)
      );

    device.addOutputs(outputDevices);
  }

  fromName(name: string): Device {
    if (!this.#devices[name]) {
      this.#devices[name] = new Device(name);
    }
    return this.#devices[name];
  }

  get you(): Device {
    return this.fromName("you");
  }

  get svr(): Device {
    return this.fromName("svr");
  }

  get out(): Device {
    return this.fromName("out");
  }

  get stamps(): Map<Device, boolean> {
    return new Map<Device, boolean>([
      [this.fromName("fft"), false],
      [this.fromName("dac"), false]
    ]);
  }
}

class Device {
  readonly #name: string;
  readonly #outputs: Device[];

  constructor(name: string) {
    this.#name = name;
    this.#outputs = [];
  }

  addOutputs(devices: Device[]) {
    this.#outputs.push(...devices);
  }

  @Memoize()
  countPathsTo(device: Device): number {
    if (this === device) {
      return 1;
    }

    return this.#outputs.reduce(
      (total, output) => total + output.countPathsTo(device),
      0
    );
  }

  @Memoize((device, stamps) =>
    [
      device.#name,
      ...stamps.entries().map(([key, value]) => `${key}=${value}`)
    ].join(",")
  )
  countPathsToWithStamps(device: Device, stamps: Map<Device, boolean>): number {
    if (stamps.has(this)) {
      stamps = new Map(stamps);
      stamps.set(this, true);
    }

    if (this === device) {
      return stamps.values().every(Boolean) ? 1 : 0;
    }

    return this.#outputs.reduce(
      (total, output) => total + output.countPathsToWithStamps(device, stamps),
      0
    );
  }

  toString(): string {
    return "Device(" + [this.#name, this.#outputs.length].join(",") + ")";
  }
}
