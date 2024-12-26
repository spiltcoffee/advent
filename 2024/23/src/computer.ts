import { Memoize } from "fast-typescript-memoize";

export class Computer {
  readonly #name: string;
  readonly #peers: Set<Computer> = new Set();

  private constructor(name: string) {
    this.#name = name;
  }

  @Memoize()
  static from(name: string): Computer {
    return new Computer(name);
  }

  get name(): string {
    return this.#name;
  }

  addPeer(peer: Computer): void {
    this.#peers.add(peer);
  }

  findSmallestCliques(): Set<string> {
    return this.#peers
      .values()
      .reduce(
        (cliques, peer) =>
          cliques.union(Computer.findSmallestCliques(this, peer)),
        new Set<string>()
      );
  }

  static findSmallestCliques(aPeer: Computer, bPeer: Computer): Set<string> {
    return new Set(
      aPeer.#peers
        .intersection(bPeer.#peers)
        .values()
        .map((cPeer) =>
          [aPeer, bPeer, cPeer]
            .map(({ name }) => name)
            .sort()
            .join()
        )
    );
  }

  //See https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
  findLargestCliques(
    potentialClique = new Set<Computer>(),
    remainingPeers = this.#peers.union(new Set([this])),
    excludedPeers = new Set<Computer>()
  ): Set<string> {
    if (remainingPeers.size === 0 && excludedPeers.size === 0) {
      return new Set<string>([
        potentialClique
          .values()
          .map(({ name }) => name)
          .toArray()
          .sort()
          .join()
      ]);
    } else {
      return remainingPeers.values().reduce((clique, peer) => {
        const setOfPeer = new Set([peer]);
        clique = clique.union(
          peer.findLargestCliques(
            potentialClique.union(setOfPeer),
            remainingPeers.intersection(peer.#peers),
            excludedPeers.intersection(peer.#peers)
          )
        );
        remainingPeers = remainingPeers.difference(setOfPeer);
        excludedPeers = excludedPeers.union(setOfPeer);
        return clique;
      }, new Set<string>());
    }
  }
}
