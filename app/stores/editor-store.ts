import { EditorState } from '../common/editor';
import { BaseStore } from './base-store';

class EditorStore extends BaseStore<EditorState> {
  private log: EditorState[] = [];
  private logIndex = 0;

  constructor() {
    super();
    this.state = {};
    this.connect();
  }

  update(changes: EditorState): Promise<void> {
    this.setState(Object.assign({}, this.state, changes));
    this.log = this.log.slice(0, this.logIndex + 1);
    this.logIndex++;
    this.log[this.logIndex] = this.state!;
    return new Promise(resolve => {
      localStorage.setItem('editor-state', JSON.stringify(this.state));
      resolve();
    });
  }

  undo() {
    if (this.logIndex > 0) {
      this.logIndex--;
      this.setState(this.log[this.logIndex]);
    }
  }

  redo() {
    if (this.logIndex < this.log.length - 1) {
      this.logIndex++;
      this.setState(this.log[this.logIndex]);
    }
  }

  async connect(): Promise<void> {
    return new Promise(resolve => {
      const stateString = localStorage.getItem('editor-state');
      this.setState(JSON.parse(stateString || '{}'));
      this.logIndex = 0;
      this.log = [this.state!];
      resolve();
    });
  }
}

export const editorStore = new EditorStore();
