import { Part, backGroupTypes, frontGroupTypes, wordGroupTypes } from '../constants/parts';

export interface PartsState {
  isLoading: boolean;
  error?: Error;
  backParts: Record<string, Part>;
  frontParts: Record<string, Part>;
  wordParts: Record<string, Part>;
}

function loadingState(): PartsState {
  return {isLoading: true, backParts: {}, frontParts: {}, wordParts: {}};
}

function successState(json: Record<string, Part>): PartsState {
  const backParts: Record<string, Part> = {};
  const frontParts: Record<string, Part> = {};
  const wordParts: Record<string, Part> = {};

  for (const id of Object.keys(json)) {
    const part = json[id];
    part.path = `/assets/images/${part.path}`;
    
    if (backGroupTypes.has(part.group)) backParts[id] = part;
    if (frontGroupTypes.has(part.group)) frontParts[id] = part;
    if (wordGroupTypes.has(part.group)) wordParts[id] = part;
  }
  
  return {
    isLoading: false,
    backParts,
    frontParts,
    wordParts,
  };
}

function errorState(error: Error): PartsState {
  return { isLoading: false, error, backParts: {}, frontParts: {}, wordParts: {} };
}

type PartsStateListener = (state: PartsState) => void;

export class PartsStore {
  private readonly listener: PartsStateListener;

  constructor(listener: PartsStateListener) {
    this.listener = listener;
  }

  async connect(): Promise<void> {
    this.listener(loadingState());
    try {
      const response = await fetch('/assets/assets.json');
      const json = await response.json();
      this.listener(successState(json));
    } catch (error) {
      this.listener(errorState(error));
    }
  }
}
