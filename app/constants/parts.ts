export interface Part {
  name: string;
  group: PartGroupType;
  path: string;
  pathToSmallImage: string;
}

export enum PartGroupType {
  BACK_NORMAL = 'BACK_NORMAL',
  BACK_SPECIAL = 'BACK_SPECIAL',
  FRONT_NORMAL = 'FRONT_NORMAL',
  FRONT_ANIMALS = 'FRONT_ANIMALS',
  FRONT_CODENAMES = 'FRONT_CODENAMES',
  FRONT_SPECIAL = 'FRONT_SPECIAL',
  WORD_NORMAL = 'WORD_NORMAL',
  WORD_PHONETIC = 'WORD_PHONETIC',
  WORD_CODENAMES = 'WORD_CODENAMES',
  WORD_NUMBER = 'WORD_NUMBER',
  WORD_LETTER = 'WORD_LETTER',
}

export const groupTypeDisplayNames = new Map([
  [PartGroupType.BACK_NORMAL, 'Normal'],
  [PartGroupType.BACK_SPECIAL, 'Special'],
  [PartGroupType.FRONT_NORMAL, 'Normal'],
  [PartGroupType.FRONT_SPECIAL, 'Special'],
  [PartGroupType.FRONT_ANIMALS, 'Animals'],
  [PartGroupType.FRONT_CODENAMES, 'Codenames'],
  [PartGroupType.WORD_NORMAL, 'Normal'],
  [PartGroupType.WORD_NUMBER, 'Numbers'],
  [PartGroupType.WORD_LETTER, 'Letter'],
  [PartGroupType.WORD_PHONETIC, 'Phonetic'],
  [PartGroupType.WORD_CODENAMES, 'Codenames'],
]);

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
  PartGroupType.WORD_NORMAL,
  PartGroupType.WORD_PHONETIC,
  PartGroupType.WORD_CODENAMES,
  PartGroupType.WORD_NUMBER,
  PartGroupType.WORD_LETTER,
]);
