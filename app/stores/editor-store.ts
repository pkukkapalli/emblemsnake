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

  // Front state
  frontChoice?: string;
  frontPrimaryColor?: string;
  frontSecondaryColor?: string;
  frontPosition?: PartPosition;
  frontScale?: number;

  // Word 1
  word1Choice?: string;
  word1PrimaryColor?: string;
  word1SecondaryColor?: string;
  word1Position?: PartPosition;
  word1Scale?: number;

  // Word 2
  word2Choice?: string;
  word2PrimaryColor?: string;
  word2SecondaryColor?: string;
  word2Position?: PartPosition;
  word2Scale?: number;
}

type EditorStateListener = (state: EditorState) => void;

export class EditorStore {
  private readonly listener: EditorStateListener;
  private state: EditorState;

  constructor(listener: EditorStateListener) {
    this.listener = listener;
    this.state = {};
  }

  connect(): Promise<void> {
    return new Promise(resolve => {
      const stateString = localStorage.getItem('editor-state');
      this.state = JSON.parse(stateString || '{}');
      this.listener(this.state);
      resolve();
    });
  }

  update(changes: EditorState): Promise<void> {
    this.state = Object.assign({}, this.state, changes);
    this.listener(this.state);
    return new Promise(resolve => {
      localStorage.setItem('editor-state', JSON.stringify(this.state));
      resolve();
    });
  }
}
