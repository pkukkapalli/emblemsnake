interface ColorScale {
  primary: string[];
  alternative: string[];
}

export interface ColorPalette {
  gray: ColorScale;
  red: ColorScale;
  orange: ColorScale;
  yellow: ColorScale;
  green: ColorScale;
  cyan: ColorScale;
  blue: ColorScale;
  purple: ColorScale;
  pink: ColorScale;
}

export interface ColorsState {
  isLoading: boolean;
  error?: Error;
  palette?: ColorPalette;
}

function loadingState(): ColorsState {
  return {
    isLoading: true,
  };
}

function successState(palette: ColorPalette): ColorsState {
  return {
    isLoading: false,
    palette,
  };
}

function errorState(error: Error): ColorsState {
  return {
    isLoading: false,
    error,
  };
}

async function fetchColorScale(color: string): Promise<ColorScale> {
  const primaryResponse = await fetch(`assets/${color}scale.txt`);
  const alternativeResponse = await fetch(`assets/${color}scale-alt.txt`);
  const primaryText = await primaryResponse.text();
  const alternativeText = await alternativeResponse.text();
  return {
    primary: primaryText.split(/\r?\n/).filter(line => line),
    alternative: alternativeText.split(/\r?\n/).filter(line => line),
  };
}

export class ColorsStore {
  private listener: (state: ColorsState) => void;

  constructor(listener: (state: ColorsState) => void) {
    this.listener = listener;
  }

  async connect(): Promise<void> {
    this.listener(loadingState());
    try {
      this.listener(
        successState({
          gray: await fetchColorScale('gray'),
          red: await fetchColorScale('red'),
          orange: await fetchColorScale('orange'),
          yellow: await fetchColorScale('yellow'),
          green: await fetchColorScale('green'),
          cyan: await fetchColorScale('cyan'),
          blue: await fetchColorScale('blue'),
          purple: await fetchColorScale('purple'),
          pink: await fetchColorScale('pink'),
        })
      );
    } catch (error) {
      this.listener(errorState(error));
    }
  }
}
