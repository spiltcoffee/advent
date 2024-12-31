export interface Light<T> {
  on(): void;
  off(): void;
  toggle(): void;
  get state(): T;
}
