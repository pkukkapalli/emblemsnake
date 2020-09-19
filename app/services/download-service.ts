import { Part } from '../common/parts';
import { PartPosition } from '../common/editor';

export enum DownloadOrientation {
  DESKTOP_LEFT_ALIGN = 'DESKTOP_LEFT_ALIGN',
  DESKTOP_CENTER_ALIGN = 'DESKTOP_CENTER_ALIGN',
  DESKTOP_RIGHT_ALIGN = 'DESKTOP_RIGHT_ALIGN',
  PHONE = 'PHONE',
  SQUARE = 'SQUARE',
}

const BLACK = '#000000';
const WHITE = '#ffffff';

export function getDownloadUrl(
  orientation: DownloadOrientation,
  {
    backChoice,
    backPrimaryColor = BLACK,
    backSecondaryColor = WHITE,
    backPosition = { x: 0, y: 0 },
    backScale = 1,
    backRotation = 0,
    frontChoice,
    frontPrimaryColor = BLACK,
    frontSecondaryColor = WHITE,
    frontPosition = { x: 0, y: 0 },
    frontScale = 1,
    frontRotation = 0,
    word1Choice,
    word1PrimaryColor = BLACK,
    word1SecondaryColor = WHITE,
    word1Position = { x: 0, y: 0 },
    word1Scale = 1,
    word1Rotation = 0,
    word2Choice,
    word2PrimaryColor = BLACK,
    word2SecondaryColor = WHITE,
    word2Position = { x: 0, y: 0 },
    word2Scale = 1,
    word2Rotation = 0,
  }: {
    backChoice?: Part;
    backPrimaryColor?: string;
    backSecondaryColor?: string;
    backPosition?: PartPosition;
    backScale?: number;
    backRotation?: number;
    frontChoice?: Part;
    frontPrimaryColor?: string;
    frontSecondaryColor?: string;
    frontPosition?: PartPosition;
    frontScale?: number;
    frontRotation?: number;
    word1Choice?: Part;
    word1PrimaryColor?: string;
    word1SecondaryColor?: string;
    word1Position?: PartPosition;
    word1Scale?: number;
    word1Rotation?: number;
    word2Choice?: Part;
    word2PrimaryColor?: string;
    word2SecondaryColor?: string;
    word2Position?: PartPosition;
    word2Scale?: number;
    word2Rotation?: number;
  }
): string {
  const body = {
    backChoice,
    backPrimaryColor,
    backSecondaryColor,
    backPosition,
    backScale,
    backRotation,
    frontChoice,
    frontPrimaryColor,
    frontSecondaryColor,
    frontPosition,
    frontScale,
    frontRotation,
    word1Choice,
    word1PrimaryColor,
    word1SecondaryColor,
    word1Position,
    word1Scale,
    word1Rotation,
    word2Choice,
    word2PrimaryColor,
    word2SecondaryColor,
    word2Position,
    word2Scale,
    word2Rotation,
    orientation,
  };
  return `/api/draw/${encodeURIComponent(JSON.stringify(body))}`;
}

export async function download(
  orientation: DownloadOrientation,
  {
    backChoice,
    backPrimaryColor = BLACK,
    backSecondaryColor = WHITE,
    backPosition = { x: 0, y: 0 },
    backScale = 1,
    backRotation = 0,
    frontChoice,
    frontPrimaryColor = BLACK,
    frontSecondaryColor = WHITE,
    frontPosition = { x: 0, y: 0 },
    frontScale = 1,
    frontRotation = 0,
    word1Choice,
    word1PrimaryColor = BLACK,
    word1SecondaryColor = WHITE,
    word1Position = { x: 0, y: 0 },
    word1Scale = 1,
    word1Rotation = 0,
    word2Choice,
    word2PrimaryColor = BLACK,
    word2SecondaryColor = WHITE,
    word2Position = { x: 0, y: 0 },
    word2Scale = 1,
    word2Rotation = 0,
  }: {
    backChoice?: Part;
    backPrimaryColor?: string;
    backSecondaryColor?: string;
    backPosition?: PartPosition;
    backScale?: number;
    backRotation?: number;
    frontChoice?: Part;
    frontPrimaryColor?: string;
    frontSecondaryColor?: string;
    frontPosition?: PartPosition;
    frontScale?: number;
    frontRotation?: number;
    word1Choice?: Part;
    word1PrimaryColor?: string;
    word1SecondaryColor?: string;
    word1Position?: PartPosition;
    word1Scale?: number;
    word1Rotation?: number;
    word2Choice?: Part;
    word2PrimaryColor?: string;
    word2SecondaryColor?: string;
    word2Position?: PartPosition;
    word2Scale?: number;
    word2Rotation?: number;
  }
): Promise<void> {
  const body = {
    backChoice,
    backPrimaryColor,
    backSecondaryColor,
    backPosition,
    backScale,
    backRotation,
    frontChoice,
    frontPrimaryColor,
    frontSecondaryColor,
    frontPosition,
    frontScale,
    frontRotation,
    word1Choice,
    word1PrimaryColor,
    word1SecondaryColor,
    word1Position,
    word1Scale,
    word1Rotation,
    word2Choice,
    word2PrimaryColor,
    word2SecondaryColor,
    word2Position,
    word2Scale,
    word2Rotation,
    orientation,
  };
  const response = await fetch(
    `/api/draw/${encodeURIComponent(JSON.stringify(body))}`
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  if (word1Choice && word2Choice) {
    link.download = `${word1Choice.name}_${word2Choice.name}.png`;
  } else if (word1Choice) {
    link.download = `${word1Choice.name}.png`;
  } else if (word2Choice) {
    link.download = `${word2Choice.name}.png`;
  } else if (backChoice && frontChoice) {
    link.download = `${backChoice.name}_${frontChoice.name}.png`;
  } else if (backChoice) {
    link.download = `${backChoice.name}.png`;
  } else if (frontChoice) {
    link.download = `${frontChoice.name}.png`;
  } else {
    link.download = 'emblem.png';
  }
  link.href = url;
  link.click();
}
