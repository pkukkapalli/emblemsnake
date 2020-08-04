import {
  backGroupTypes,
  frontGroupTypes,
  wordGroupTypes,
  Part,
} from '../constants/parts';

export interface PartsState {
  isLoading: boolean;
  error?: Error;
  backParts: Part[];
  frontParts: Part[];
  wordParts: Part[];
}

function loadingState(): PartsState {
  return {
    isLoading: true,
    backParts: [],
    frontParts: [],
    wordParts: [],
  };
}

function successState(json: Part[]): PartsState {
  return {
    isLoading: false,
    backParts: json.filter(part => backGroupTypes.has(part.group)),
    frontParts: json.filter(part => frontGroupTypes.has(part.group)),
    wordParts: json.filter(part => wordGroupTypes.has(part.group)),
  };
}

function errorState(error: Error): PartsState {
  return {
    isLoading: false,
    error,
    backParts: [],
    frontParts: [],
    wordParts: [],
  };
}

export class PartsStore {
  private listener: (state: PartsState) => void;

  constructor(listener: (state: PartsState) => void) {
    this.listener = listener;
  }

  async connect(): Promise<void> {
    this.listener(loadingState());
    try {
      const response = await fetch('assets/assets.json');
      const json = await response.json();
      this.listener(successState(json));
    } catch (error) {
      this.listener(errorState(error));
    }
  }
}
