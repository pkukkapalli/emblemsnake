export interface PartPosition {
  x: number;
  y: number;
}

export interface EditorState {
  backChoice?: string;
  backPrimaryColor?: string;
  backSecondaryColor?: string;
  backPosition?: PartPosition;
  frontChoice?: string;
  frontPrimaryColor?: string;
  frontSecondaryColor?: string;
  frontPosition?: PartPosition;
  word1Choice?: string;
  word1PrimaryColor?: string;
  word1SecondaryColor?: string;
  word1Position?: PartPosition;
  word2Choice?: string;
  word2PrimaryColor?: string;
  word2SecondaryColor?: string;
  word2Position?: PartPosition;
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
