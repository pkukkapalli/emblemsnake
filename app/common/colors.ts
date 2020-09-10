export interface ColorsState {
  isLoading: boolean;
  error?: string;
  grayscale: string[];
  grayscaleAlternative: string[];
  bluescale: string[];
  bluescaleAlternative: string[];
  cyanscale: string[];
  cyanscaleAlternative: string[];
  greenscale: string[];
  greenscaleAlternative: string[];
  orangescale: string[];
  orangescaleAlternative: string[];
  pinkscale: string[];
  pinkscaleAlternative: string[];
  purplescale: string[];
  purplescaleAlternative: string[];
  redscale: string[];
  redscaleAlternative: string[];
  yellowscale: string[];
  yellowscaleAlternative: string[];
}

export function loadingColorsState(): ColorsState {
  return {
    isLoading: true,
    grayscale: [],
    grayscaleAlternative: [],
    bluescale: [],
    bluescaleAlternative: [],
    cyanscale: [],
    cyanscaleAlternative: [],
    greenscale: [],
    greenscaleAlternative: [],
    orangescale: [],
    orangescaleAlternative: [],
    pinkscale: [],
    pinkscaleAlternative: [],
    purplescale: [],
    purplescaleAlternative: [],
    redscale: [],
    redscaleAlternative: [],
    yellowscale: [],
    yellowscaleAlternative: [],
  };
}

export function errorColorsState(error: string): ColorsState {
  return {
    isLoading: false,
    error,
    grayscale: [],
    grayscaleAlternative: [],
    bluescale: [],
    bluescaleAlternative: [],
    cyanscale: [],
    cyanscaleAlternative: [],
    greenscale: [],
    greenscaleAlternative: [],
    orangescale: [],
    orangescaleAlternative: [],
    pinkscale: [],
    pinkscaleAlternative: [],
    purplescale: [],
    purplescaleAlternative: [],
    redscale: [],
    redscaleAlternative: [],
    yellowscale: [],
    yellowscaleAlternative: [],
  };
}
