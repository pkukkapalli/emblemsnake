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

export function loadingState(): ColorsState {
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

function errorState(error: string): ColorsState {
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

type ColorsStateListener = (palette: ColorsState) => void;

export class ColorsStore {
  private readonly listener: ColorsStateListener;

  constructor(listener: ColorsStateListener) {
    this.listener = listener;
  }

  async connect(): Promise<void> {
    this.listener(loadingState());
    try {
      this.listener({
        isLoading: false,
        bluescale: await this.fetchColorscale('/assets/bluescale.txt'),
        bluescaleAlternative: await this.fetchColorscale('/assets/bluescale-alt.txt'),
        cyanscale: await this.fetchColorscale('/assets/cyanscale.txt'),
        cyanscaleAlternative: await this.fetchColorscale('/assets/cyanscale-alt.txt'),
        grayscale: await this.fetchColorscale('/assets/grayscale.txt'),
        grayscaleAlternative: await this.fetchColorscale('/assets/grayscale-alt.txt'),
        greenscale: await this.fetchColorscale('/assets/greenscale.txt'),
        greenscaleAlternative: await this.fetchColorscale('/assets/greenscale-alt.txt'),
        orangescale: await this.fetchColorscale('/assets/orangescale.txt'),
        orangescaleAlternative: await this.fetchColorscale('/assets/orangescale-alt.txt'),
        pinkscale: await this.fetchColorscale('/assets/pinkscale.txt'),
        pinkscaleAlternative: await this.fetchColorscale('/assets/pinkscale-alt.txt'),
        purplescale: await this.fetchColorscale('/assets/purplescale.txt'),
        purplescaleAlternative: await this.fetchColorscale('/assets/purplescale-alt.txt'),
        redscale: await this.fetchColorscale('/assets/redscale.txt'),
        redscaleAlternative: await this.fetchColorscale('/assets/redscale-alt.txt'),
        yellowscale: await this.fetchColorscale('/assets/yellowscale.txt'),
        yellowscaleAlternative: await this.fetchColorscale('/assets/yellowscale-alt.txt'),
      });
    } catch (error) {
      this.listener(errorState(error));
    }
  }

  private async fetchColorscale(path: string): Promise<string[]> {
    const response = await fetch(path);
    const text = await response.text();
    return text.split('\n').filter(color => color);
  }
}
