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

function successState(json: Record<string, Part>): PartsState {
  const backParts = [];
  const frontParts = [];
  const wordParts = [];
  for (const id of Object.keys(json)) {
    const part = json[id];
    part.id = id;

    if (part.path) {
      part.path = `/assets/images/${part.path}`;
    }
    
    if (backGroupTypes.has(part.group)) {
      backParts.push(part);
    } else if (frontGroupTypes.has(part.group)) {
      frontParts.push(part);
    } else if (wordGroupTypes.has(part.group)) {
      wordParts.push(part);
    }
  }

  return {
    isLoading: false,
    backParts,
    frontParts,
    wordParts,
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
