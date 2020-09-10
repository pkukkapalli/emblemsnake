type StateListener<T> = (state: T) => void;

export class BaseStore<T> {
  state?: T;
  private listeners: StateListener<T>[] = [];

  listen(listener: StateListener<T>) {
    this.listeners.push(listener);
  }

  setState(state: T) {
    this.state = state;
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
