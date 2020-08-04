import { PartType } from './parts';

// TODO: replace with integer enum
export enum PartActionType {
  CHOOSE = 'CHOOSE',
  ADJUST = 'ADJUST',
  PRIMARY_COLOR = 'PRIMARY_COLOR',
  SECONDARY_COLOR = 'SECONDARY_COLOR',
}

// TODO: replace with integer enum
export enum ViewType {
  MAIN_MENU = 'MAIN_MENU',

  // Back
  BACK_MENU = 'BACK_MENU',
  CHOOSE_BACK_MENU = 'CHOOSE_BACK_MENU',
  ADJUST_BACK_MENU = 'ADJUST_BACK_MENU',
  PRIMARY_COLOR_BACK_MENU = 'PRIMARY_COLOR_BACK_MENU',
  SECONDARY_COLOR_BACK_MENU = 'SECONDARY_COLOR_BACK_MENU',

  // Front
  FRONT_MENU = 'FRONT_MENU',
  CHOOSE_FRONT_MENU = 'CHOOSE_FRONT_MENU',
  ADJUST_FRONT_MENU = 'ADJUST_FRONT_MENU',
  PRIMARY_COLOR_FRONT_MENU = 'PRIMARY_COLOR_FRONT_MENU',
  SECONDARY_COLOR_FRONT_MENU = 'SECONDARY_COLOR_FRONT_MENU',

  // Word 1
  WORD1_MENU = 'WORD1_MENU',
  CHOOSE_WORD1_MENU = 'CHOOSE_WORD1_MENU',
  ADJUST_WORD1_MENU = 'ADJUST_WORD1_MENU',
  PRIMARY_COLOR_WORD1_MENU = 'PRIMARY_COLOR_WORD1_MENU',
  SECONDARY_COLOR_WORD1_MENU = 'SECONDARY_COLOR_WORD1_MENU',

  // Word 2
  WORD2_MENU = 'WORD2_MENU',
  CHOOSE_WORD2_MENU = 'CHOOSE_WORD2_MENU',
  ADJUST_WORD2_MENU = 'ADJUST_WORD2_MENU',
  PRIMARY_COLOR_WORD2_MENU = 'PRIMARY_COLOR_WORD2_MENU',
  SECONDARY_COLOR_WORD2_MENU = 'SECONDARY_COLOR_WORD2_MENU',
}

export const routeToViewType = new Map([
  ['/', ViewType.MAIN_MENU],

  // Back
  ['/back', ViewType.BACK_MENU],
  ['/back/choose', ViewType.CHOOSE_BACK_MENU],
  ['/back/adjust', ViewType.ADJUST_BACK_MENU],
  ['/back/primarycolor', ViewType.PRIMARY_COLOR_BACK_MENU],
  ['/back/secondarycolor', ViewType.SECONDARY_COLOR_BACK_MENU],

  // Front
  ['/front', ViewType.FRONT_MENU],
  ['/front/choose', ViewType.CHOOSE_FRONT_MENU],
  ['/front/adjust', ViewType.ADJUST_FRONT_MENU],
  ['/front/primarycolor', ViewType.PRIMARY_COLOR_FRONT_MENU],
  ['/front/secondarycolor', ViewType.SECONDARY_COLOR_FRONT_MENU],

  // Word 1
  ['/word1', ViewType.WORD1_MENU],
  ['/word1/choose', ViewType.CHOOSE_WORD1_MENU],
  ['/word1/adjust', ViewType.ADJUST_WORD1_MENU],
  ['/word1/primarycolor', ViewType.PRIMARY_COLOR_WORD1_MENU],
  ['/word1/secondarycolor', ViewType.SECONDARY_COLOR_WORD1_MENU],

  // Word 2
  ['/word2', ViewType.WORD2_MENU],
  ['/word2/choose', ViewType.CHOOSE_WORD2_MENU],
  ['/word2/adjust', ViewType.ADJUST_WORD2_MENU],
  ['/word2/primarycolor', ViewType.PRIMARY_COLOR_WORD2_MENU],
  ['/word2/secondarycolor', ViewType.SECONDARY_COLOR_WORD2_MENU],
]);

export const viewTypeToRoute = new Map(
  Array.from(routeToViewType.entries()).map(([key, value]) => [value, key])
);

const partTypeToSubroute = new Map([
  [PartType.BACK, 'back'],
  [PartType.FRONT, 'front'],
  [PartType.WORD_1, 'word1'],
  [PartType.WORD_2, 'word2'],
]);

const partActionTypeToSubroute = new Map([
  [PartActionType.CHOOSE, 'choose'],
  [PartActionType.ADJUST, 'adjust'],
  [PartActionType.PRIMARY_COLOR, 'primarycolor'],
  [PartActionType.SECONDARY_COLOR, 'secondarycolor'],
]);

export function calculateRoute(
  partType?: PartType,
  partActionType?: PartActionType
): string {
  let route = '/';

  if (partType) {
    route = `/${partTypeToSubroute.get(partType)}`;
  }

  if (partActionType) {
    route = `${route}/${partActionTypeToSubroute.get(partActionType)}`;
  }

  return route;
}
