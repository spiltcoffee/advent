export enum Stat {
  CAPACITY = "CAPACITY",
  DURABILITY = "DURABILITY",
  FLAVOR = "FLAVOR",
  TEXTURE = "TEXTURE",
  CALORIES = "CALORIES"
}

export type StatSansCalories =
  | Stat.CALORIES
  | Stat.DURABILITY
  | Stat.FLAVOR
  | Stat.TEXTURE;
