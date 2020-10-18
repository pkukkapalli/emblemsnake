import { ColorsState } from '../common/colors';
import { BaseStore } from './base-store';

export class ColorsStore extends BaseStore<ColorsState> {
  constructor() {
    super();
    this.state = {
      bluescale: ['#9DA9CE', '#6B79C0', '#46529A', '#39447B', '#2E365E'],
      bluescaleAlternative: [
        '#99AE97',
        '#7C9689',
        '#5E7671',
        '#4E5A58',
        '#3F443F',
      ],
      cyanscale: ['#80C7CA', '#00B4BE', '#008E98', '#006F79', '#00575C'],
      cyanscaleAlternative: [
        '#99B096',
        '#6BA589',
        '#5D8171',
        '#536156',
        '#42453E',
      ],
      grayscale: [
        '#FFFFFF',
        '#C0C0C0',
        '#A0A0A0',
        '#808080',
        '#606060',
        '#404040',
        '#202020',
        '#000000',
      ],
      grayscaleAlternative: [
        '#CBC8B3',
        '#9B9D86',
        '#837B70',
        '#797369',
        '#776E63',
        '#6D685E',
        '#696057',
        '#5F5850',
      ],
      greenscale: ['#59D99B', '#00CB6B', '#009548', '#006B40', '#004F2F'],
      greenscaleAlternative: [
        '#99B087',
        '#819C6C',
        '#62764D',
        '#51533D',
        '#413E2F',
      ],
      orangescale: ['#DDAD8D', '#E38248', '#AD5B2A', '#834521', '#5D321D'],
      orangescaleAlternative: [
        '#AA9B81',
        '#A97662',
        '#835746',
        '#5D4536',
        '#43322A',
      ],
      pinkscale: ['#ED85BE', '#F100A2', '#C20079', '#9C0063', '#77004D'],
      pinkscaleAlternative: [
        '#BBA39B',
        '#B37D8C',
        '#9C5A74',
        '#794B59',
        '#563C43',
      ],
      purplescale: ['#CA89CC', '#B700C0', '#900098', '#730079', '#5C005F'],
      purplescaleAlternative: [
        '#A9A695',
        '#958387',
        '#77636D',
        '#5D5154',
        '#493E40',
      ],
      redscale: ['#EF7994', '#F4005A', '#E70038', '#9E002C', '#790021'],
      redscaleAlternative: [
        '#B38F81',
        '#AE6466',
        '#914248',
        '#673B36',
        '#47312A',
      ],
      yellowscale: ['#D0CB8E', '#CBBC4A', '#978B2A', '#736924', '#524C1C'],
      yellowscaleAlternative: [
        '#ABA882',
        '#A29260',
        '#826B41',
        '#5D4F33',
        '#453827',
      ],
    };
  }
}

export const colorsStore = new ColorsStore();
