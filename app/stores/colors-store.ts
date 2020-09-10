import {
  loadingColorsState,
  errorColorsState,
  ColorsState,
} from '../common/colors';
import { BaseStore } from './base-store';

export class ColorsStore extends BaseStore<ColorsState> {
  constructor() {
    super();
    this.state = loadingColorsState();
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.setState({
        isLoading: false,
        bluescale: await this.fetchColorscale('/assets/bluescale.txt'),
        bluescaleAlternative: await this.fetchColorscale(
          '/assets/bluescale-alt.txt'
        ),
        cyanscale: await this.fetchColorscale('/assets/cyanscale.txt'),
        cyanscaleAlternative: await this.fetchColorscale(
          '/assets/cyanscale-alt.txt'
        ),
        grayscale: await this.fetchColorscale('/assets/grayscale.txt'),
        grayscaleAlternative: await this.fetchColorscale(
          '/assets/grayscale-alt.txt'
        ),
        greenscale: await this.fetchColorscale('/assets/greenscale.txt'),
        greenscaleAlternative: await this.fetchColorscale(
          '/assets/greenscale-alt.txt'
        ),
        orangescale: await this.fetchColorscale('/assets/orangescale.txt'),
        orangescaleAlternative: await this.fetchColorscale(
          '/assets/orangescale-alt.txt'
        ),
        pinkscale: await this.fetchColorscale('/assets/pinkscale.txt'),
        pinkscaleAlternative: await this.fetchColorscale(
          '/assets/pinkscale-alt.txt'
        ),
        purplescale: await this.fetchColorscale('/assets/purplescale.txt'),
        purplescaleAlternative: await this.fetchColorscale(
          '/assets/purplescale-alt.txt'
        ),
        redscale: await this.fetchColorscale('/assets/redscale.txt'),
        redscaleAlternative: await this.fetchColorscale(
          '/assets/redscale-alt.txt'
        ),
        yellowscale: await this.fetchColorscale('/assets/yellowscale.txt'),
        yellowscaleAlternative: await this.fetchColorscale(
          '/assets/yellowscale-alt.txt'
        ),
      });
    } catch (error) {
      this.setState(errorColorsState(error));
    }
  }

  private async fetchColorscale(path: string): Promise<string[]> {
    const response = await fetch(path);
    const text = await response.text();
    return text.split('\n').filter(color => color);
  }
}

export const colorsStore = new ColorsStore();
