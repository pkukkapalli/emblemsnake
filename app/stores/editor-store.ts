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

type EditorStateListener = (state: EditorState) => void;

export class EditorStore {
  private readonly listener: EditorStateListener;
  private state: EditorState;
  private log: EditorState[];
  private logIndex: number;

  constructor(listener: EditorStateListener) {
    this.listener = listener;
    this.state = {};
    this.log = [];
    this.logIndex = 0;
  }

  connect(): Promise<void> {
    return new Promise(resolve => {
      const stateString = localStorage.getItem('editor-state');
      this.state = JSON.parse(stateString || '{}');
      this.log = [this.state];
      this.listener(this.state);
      resolve();
    });
  }

  update(changes: EditorState): Promise<void> {
    this.state = Object.assign({}, this.state, changes);
    this.log = this.log.slice(0, this.logIndex + 1);
    this.logIndex++;
    this.log[this.logIndex] = this.state;
    this.listener(this.state);
    return new Promise(resolve => {
      localStorage.setItem('editor-state', JSON.stringify(this.state));
      resolve();
    });
  }

  undo() {
    if (this.logIndex > 0) {
      this.logIndex--;
      this.state = this.log[this.logIndex];
      this.listener(this.state);
    }
  }

  redo() {
    if (this.logIndex < this.log.length - 1) {
      this.logIndex++;
      this.state = this.log[this.logIndex];
      this.listener(this.state);
    }
  }
}
