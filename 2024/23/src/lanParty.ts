import { Computer } from "./computer.ts";

export class LanParty {
  readonly #peers: Set<Computer> = new Set();

  static fromInput(input: string) {
    const lanParty = new LanParty();

    input
      .split("\n")
      .forEach((pair) =>
        lanParty.addPeers(
          ...(pair.split("-", 2).map((name) => Computer.from(name)) as [
            Computer,
            Computer
          ])
        )
      );

    return lanParty;
  }

  addPeers(aPeer: Computer, bPeer: Computer): void {
    aPeer.addPeer(bPeer);
    bPeer.addPeer(aPeer);
    this.#peers.add(aPeer).add(bPeer);
  }

  findSmallestCliques(filterRegExp: RegExp): Set<string> {
    return this.#peers
      .values()
      .filter((peer) => filterRegExp.exec(peer.name))
      .reduce(
        (cliques, peer) => cliques.union(peer.findSmallestCliques()),
        new Set<string>()
      );
  }

  findLargestClique(filterRegExp: RegExp): string {
    return this.#peers
      .values()
      .filter((peer) => filterRegExp.exec(peer.name))
      .reduce(
        (cliques, peer) => cliques.union(peer.findLargestCliques()),
        new Set<string>()
      )
      .values()
      .toArray()
      .sort(({ length: a }, { length: b }) => b - a)
      .at(0);
  }
}
