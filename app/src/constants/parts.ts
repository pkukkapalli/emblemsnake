export interface Part {
  name: string;
  group: PartGroupType;
  path?: string;
}

// TODO: replace with an integer enum
export enum PartType {
  BACK = 'BACK',
  FRONT = 'FRONT',
  WORD_1 = 'WORD_1',
  WORD_2 = 'WORD_2',
}

export const partTypeDisplayNames = new Map([
  [PartType.BACK, 'Back'],
  [PartType.FRONT, 'Front'],
  [PartType.WORD_1, 'Word 1'],
  [PartType.WORD_2, 'Word 2'],
]);

// TODO: replace with an integer enum
export enum PartGroupType {
  BACK_NORMAL = 'BACK_NORMAL',
  BACK_SPECIAL = 'BACK_SPECIAL',
  FRONT_NORMAL = 'FRONT_NORMAL',
  FRONT_ANIMALS = 'FRONT_ANIMALS',
  FRONT_CODENAMES = 'FRONT_CODENAMES',
  FRONT_SPECIAL = 'FRONT_SPECIAL',
  WORD_NUMBER = 'WORD_NUMBER',
  WORD_LETTER = 'WORD_LETTER',
  WORD_NORMAL = 'WORD_NORMAL',
  WORD_PHONETIC = 'WORD_PHONETIC',
  WORD_CODENAMES = 'WORD_CODENAMES',
}

export const backGroupTypes = new Set([
  PartGroupType.BACK_NORMAL,
  PartGroupType.BACK_SPECIAL,
]);

export const frontGroupTypes = new Set([
  PartGroupType.FRONT_NORMAL,
  PartGroupType.FRONT_ANIMALS,
  PartGroupType.FRONT_CODENAMES,
  PartGroupType.FRONT_SPECIAL,
]);

export const wordGroupTypes = new Set([
  PartGroupType.WORD_NUMBER,
  PartGroupType.WORD_LETTER,
  PartGroupType.WORD_NORMAL,
  PartGroupType.WORD_PHONETIC,
  PartGroupType.WORD_CODENAMES,
]);
