export interface PartPosition {
  x: number;
  y: number;
}

export interface EditorState {
  // Back state
  backChoice?: string;
  backPrimaryColor?: string;
  backSecondaryColor?: string;
  backPosition?: PartPosition;
  backScale?: number;
  backRotation?: number;

  // Front state
  frontChoice?: string;
  frontPrimaryColor?: string;
  frontSecondaryColor?: string;
  frontPosition?: PartPosition;
  frontScale?: number;
  frontRotation?: number;

  // Word 1
  word1Choice?: string;
  word1PrimaryColor?: string;
  word1SecondaryColor?: string;
  word1Position?: PartPosition;
  word1Scale?: number;
  word1Rotation?: number;

  // Word 2
  word2Choice?: string;
  word2PrimaryColor?: string;
  word2SecondaryColor?: string;
  word2Position?: PartPosition;
  word2Scale?: number;
  word2Rotation?: number;
}
