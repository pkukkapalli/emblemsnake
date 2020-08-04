import { Part } from '../constants/parts';

export interface EditorState {
  backChoice?: Part;
  backPrimaryColor?: string;
  backSecondaryColor?: string;
  frontChoice?: Part;
  frontPrimaryColor?: string;
  frontSecondaryColor?: string;
  word1Choice?: Part;
  word1PrimaryColor?: string;
  word1SecondaryColor?: string;
  word2Choice?: Part;
  word2PrimaryColor?: string;
  word2SecondaryColor?: string;
}

const defaultPrimaryColor = '#000000';
const defaultSecondaryColor = '#ffffff';

const defaultState = {
  backPrimaryColor: defaultPrimaryColor,
  backSecondaryColor: defaultSecondaryColor,
  frontPrimaryColor: defaultPrimaryColor,
  frontSecondaryColor: defaultSecondaryColor,
  word1PrimaryColor: defaultPrimaryColor,
  word1SecondaryColor: defaultSecondaryColor,
  word2PrimaryColor: defaultPrimaryColor,
  word2SecondaryColor: defaultSecondaryColor,
};

export class EditorStore {
  private state: EditorState;
  private worker: Worker;

  private listener: (state: EditorState) => void;

  constructor(listener: (state: EditorState) => void) {
    this.state = defaultState;
    this.listener = listener;
    this.worker = new Worker('../workers/rendering-worker.js');
  }

  connect(): void {
    const state = localStorage.getItem('state');
    if (state) {
      this.state = JSON.parse(state);
    }
    this.listener(this.state);
    this.worker.postMessage('test');
    this.worker.onmessage = function (): void {
      console.log('main received reply');
    };
  }

  setBackChoice(backChoice: Part): void {
    this.update({ backChoice });
  }

  setBackPrimaryColor(backPrimaryColor: string): void {
    this.update({ backPrimaryColor });
  }

  setBackSecondaryColor(backSecondaryColor: string): void {
    this.update({ backSecondaryColor });
  }

  setFrontChoice(frontChoice: Part): void {
    this.update({ frontChoice });
  }

  setFrontPrimaryColor(frontPrimaryColor: string): void {
    this.update({ frontPrimaryColor });
  }

  setFrontSecondaryColor(frontSecondaryColor: string): void {
    this.update({ frontSecondaryColor });
  }

  setWord1Choice(word1Choice: Part): void {
    this.update({ word1Choice });
  }

  setWord1PrimaryColor(word1PrimaryColor: string): void {
    this.update({ word1PrimaryColor });
  }

  setWord1SecondaryColor(word1SecondaryColor: string): void {
    this.update({ word1SecondaryColor });
  }

  setWord2Choice(word2Choice: Part): void {
    this.update({ word2Choice });
  }

  setWord2PrimaryColor(word2PrimaryColor: string): void {
    this.update({ word2PrimaryColor });
  }

  setWord2SecondaryColor(word2SecondaryColor: string): void {
    this.update({ word2SecondaryColor });
  }

  update(updates: EditorState): void {
    this.state = { ...this.state, ...updates };
    this.listener(this.state);
    localStorage.setItem('state', JSON.stringify(this.state));
  }
}
