import {
  loadingPartsState,
  successPartsState,
  errorPartsState,
  PartsState,
} from '../common/parts';
import { BaseStore } from './base-store';

class PartsStore extends BaseStore<PartsState> {
  constructor() {
    super();
    this.state = loadingPartsState();
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const response = await fetch('/assets/assets.json');
      const json = await response.json();
      this.setState(successPartsState(json));
    } catch (error) {
      this.setState(errorPartsState(error));
    }
  }
}

export const partsStore = new PartsStore();
