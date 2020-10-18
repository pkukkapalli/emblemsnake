import {
  LitElement,
  html,
  customElement,
  TemplateResult,
  CSSResult,
  css,
  internalProperty,
} from 'lit-element';
import {
  Part,
  backGroupTypes,
  PartGroupType,
  frontGroupTypes,
  wordGroupTypes,
  loadingPartsState,
  PartsState,
} from '../common/parts';
import { Tab } from './emblem-tabs';
import { Tab as ColorTab } from './emblem-color-menu';
import './emblem-image-menu';
import './emblem-word-menu';
import './emblem-preview';
import { editorStore } from '../stores/editor-store';
import { classMap } from 'lit-html/directives/class-map';
import { ColorsState } from '../common/colors';
import { EditorState } from '../common/editor';
import { colorsStore } from '../stores/colors-store';
import { partsStore } from '../stores/parts-store';

const defaultGroupForTab = new Map([
  [Tab.BACK, PartGroupType.BACK_NORMAL],
  [Tab.FRONT, PartGroupType.FRONT_NORMAL],
  [Tab.WORD_1, PartGroupType.WORD_NORMAL],
  [Tab.WORD_2, PartGroupType.WORD_NORMAL],
]);

const BLACK = '#000000';
const WHITE = '#ffffff';
const ORIGIN = { x: 0, y: 0 };

@customElement('emblem-app')
export class EmblemApp extends LitElement {
  @internalProperty()
  private partsState: PartsState;

  @internalProperty()
  private colorsState: ColorsState;

  @internalProperty()
  private editorState: EditorState;

  @internalProperty()
  private tab = Tab.BACK;

  @internalProperty()
  private group = defaultGroupForTab.get(Tab.BACK);

  @internalProperty()
  private primaryColorTab = ColorTab.MAIN;

  @internalProperty()
  private secondaryColorTab = ColorTab.MAIN;

  @internalProperty()
  private isInfoOpen = true;

  constructor() {
    super();
    this.colorsState = colorsStore.state!;
    this.editorState = editorStore.state || {};
    this.partsState = partsStore.state || loadingPartsState();
    colorsStore.listen(state => {
      this.colorsState = state;
    });
    editorStore.listen(state => {
      this.editorState = state;
    });
    partsStore.listen(state => {
      this.partsState = state;
    });
  }

  static get styles(): CSSResult {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      @media only screen and (min-width: 600px) {
        .container {
          flex-direction: row;
        }
      }

      .menu {
        flex: 6;
        background: lightgray;
        box-sizing: border-box;
      }

      @media only screen and (min-width: 600px) {
        .menu {
          overflow-x: hidden;
        }
      }

      .tabs-container {
        overflow-x: auto;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      }

      .info {
        display: flex;
        align-items: center;
        background: #eee;
        margin-left: 1rem;
        margin-right: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
      }

      .info-hidden {
        display: none;
      }

      .info:not(:first-child) {
        margin-right: 1rem;
      }

      .info-message {
        flex: 1;
      }

      .info-icon {
        margin-right: 1rem;
      }

      .remove-info {
        margin-left: 1rem;
        cursor: pointer;
      }

      .tags-container {
        margin-bottom: 2rem;
        line-height: 3rem;
      }

      .tag {
        padding: 0.5rem 1rem;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        background: #eee;
        line-height: 0;
        margin-left: 1rem;
      }

      .no-tag {
        display: none;
      }

      .remove-tag {
        margin-left: 1rem;
        cursor: pointer;
        line-height: 0;
      }

      .colors {
        display: flex;
        flex-direction: column;
        margin-bottom: 2rem;
        margin-left: 2rem;
        margin-right: 2rem;
      }

      @media only screen and (min-width: 600px) {
        .colors {
          flex-direction: row;
        }
      }

      emblem-color-menu {
        flex: 1;
      }

      emblem-color-menu:not(:first-child) {
        margin-top: 2rem;
      }

      @media only screen and (min-width: 600px) {
        emblem-color-menu:not(:first-child) {
          margin-top: 0;
          margin-left: 2rem;
        }
      }

      emblem-preview {
        flex: 4;
        min-height: 500px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <emblem-preview
          .tab=${this.tab}
          @undo=${() => editorStore.undo()}
          @redo=${() => editorStore.redo()}
          .backChoice=${this.getBackChoice()}
          .backPrimaryColor=${this.editorState?.backPrimaryColor}
          .backSecondaryColor=${this.editorState?.backSecondaryColor}
          .backPosition=${this.editorState?.backPosition}
          @move-back=${(event: CustomEvent) => this.handleMoveBack(event)}
          .backScale=${this.editorState?.backScale}
          @scale-back=${(event: CustomEvent) => this.handleScaleBack(event)}
          .backRotation=${this.editorState?.backRotation}
          @rotate-back=${(event: CustomEvent) => this.handleRotateBack(event)}
          .frontChoice=${this.getFrontChoice()}
          .frontPrimaryColor=${this.editorState?.frontPrimaryColor}
          .frontSecondaryColor=${this.editorState?.frontSecondaryColor}
          .frontPosition=${this.editorState?.frontPosition}
          @move-front=${(event: CustomEvent) => this.handleMoveFront(event)}
          .frontScale=${this.editorState?.frontScale}
          @scale-front=${(event: CustomEvent) => this.handleScaleFront(event)}
          .frontRotation=${this.editorState?.frontRotation}
          @rotate-front=${(event: CustomEvent) => this.handleRotateFront(event)}
          .word1Choice=${this.getWord1Choice()}
          .word1PrimaryColor=${this.editorState?.word1PrimaryColor}
          .word1SecondaryColor=${this.editorState?.word1SecondaryColor}
          .word1Position=${this.editorState?.word1Position}
          @move-word1=${(event: CustomEvent) => this.handleMoveWord1(event)}
          .word1Scale=${this.editorState?.word1Scale}
          @scale-word1=${(event: CustomEvent) => this.handleScaleWord1(event)}
          .word1Rotation=${this.editorState?.word1Rotation}
          @rotate-word1=${(event: CustomEvent) => this.handleRotateWord1(event)}
          .word2Choice=${this.getWord2Choice()}
          .word2PrimaryColor=${this.editorState?.word2PrimaryColor}
          .word2SecondaryColor=${this.editorState?.word2SecondaryColor}
          .word2Position=${this.editorState?.word2Position}
          @move-word2=${(event: CustomEvent) => this.handleMoveWord2(event)}
          .word2Scale=${this.editorState?.word2Scale}
          @scale-word2=${(event: CustomEvent) => this.handleScaleWord2(event)}
          .word2Rotation=${this.editorState?.word2Rotation}
          @rotate-word2=${(event: CustomEvent) => this.handleRotateWord2(event)}
        >
        </emblem-preview>
        <div class="menu">
          ${this.renderTabs()} ${this.renderInfo()} ${this.renderTags()}
          ${this.renderColors()} ${this.renderParts()}
        </div>
      </div>
    `;
  }

  private getBackChoice(): Part | undefined {
    return this.partsState?.backParts[this.editorState?.backChoice || ''];
  }

  private getFrontChoice(): Part | undefined {
    return this.partsState?.frontParts[this.editorState?.frontChoice || ''];
  }

  private getWord1Choice(): Part | undefined {
    return this.partsState?.wordParts[this.editorState?.word1Choice || ''];
  }

  private getWord2Choice(): Part | undefined {
    return this.partsState?.wordParts[this.editorState?.word2Choice || ''];
  }

  private renderTabs(): TemplateResult {
    return html`
      <div class="tabs-container">
        <emblem-tabs
          .tab=${this.tab}
          @tab-change=${(event: CustomEvent) =>
            this.handleTabChange(event.detail.tab)}
        >
        </emblem-tabs>
      </div>
    `;
  }

  private renderInfo(): TemplateResult {
    return html`
      <div class=${classMap({ info: true, 'info-hidden': !this.isInfoOpen })}>
        <div class="info-icon"><img src="/assets/info.svg" /></div>
        <div class="info-message">
          <a
            href="https://github.com/pkukkapalli/emblemsnake/blob/master/INSTRUCTIONS.md"
            >Click here for instructions</a
          >, and read the code on
          <a href="https://github.com/pkukkapalli/emblemsnake">GitHub</a>.
        </div>
        <div
          class="remove-info"
          @click=${() => {
            this.isInfoOpen = false;
          }}
        >
          <img src="/assets/close.svg" />
        </div>
      </div>
    `;
  }

  private renderTags(): TemplateResult {
    const backChoice = this.getBackChoice();
    const frontChoice = this.getFrontChoice();
    const word1Choice = this.getWord1Choice();
    const word2Choice = this.getWord2Choice();
    return html`
      <div class="tags-container">
        <div class=${classMap({ tag: true, 'no-tag': !backChoice })}>
          Back: ${backChoice?.name.toUpperCase()}
          <div class="remove-tag" @click=${() => this.handleClearBack()}>
            <img src="/assets/close.svg" />
          </div>
        </div>
        <div class=${classMap({ tag: true, 'no-tag': !frontChoice })}>
          Front: ${frontChoice?.name.toUpperCase()}
          <div class="remove-tag" @click=${() => this.handleClearFront()}>
            <img src="/assets/close.svg" />
          </div>
        </div>
        <div class=${classMap({ tag: true, 'no-tag': !word1Choice })}>
          Word 1: ${word1Choice?.name.toUpperCase()}
          <div class="remove-tag" @click=${() => this.handleClearWord1()}>
            <img src="/assets/close.svg" />
          </div>
        </div>
        <div class=${classMap({ tag: true, 'no-tag': !word2Choice })}>
          Word 2: ${word2Choice?.name.toUpperCase()}
          <div class="remove-tag" @click=${() => this.handleClearWord2()}>
            <img src="/assets/close.svg" />
          </div>
        </div>
      </div>
    `;
  }

  private handleClearBack() {
    editorStore.update({
      backChoice: '',
      backPrimaryColor: BLACK,
      backSecondaryColor: WHITE,
      backPosition: ORIGIN,
      backScale: 1,
      backRotation: 0,
    });
  }

  private handleClearFront() {
    editorStore.update({
      frontChoice: '',
      frontPrimaryColor: BLACK,
      frontSecondaryColor: WHITE,
      frontPosition: ORIGIN,
      frontScale: 1,
      frontRotation: 0,
    });
  }

  private handleClearWord1() {
    editorStore.update({
      word1Choice: '',
      word1PrimaryColor: BLACK,
      word1SecondaryColor: WHITE,
      word1Position: ORIGIN,
      word1Scale: 1,
      word1Rotation: 0,
    });
  }

  private handleClearWord2() {
    editorStore.update({
      word2Choice: '',
      word2PrimaryColor: BLACK,
      word2SecondaryColor: WHITE,
      word2Position: ORIGIN,
      word2Scale: 1,
      word2Rotation: 0,
    });
  }

  private handleTabChange(tab: Tab) {
    this.tab = tab;
    this.group = defaultGroupForTab.get(tab);
  }

  private renderColors(): TemplateResult {
    return html`
      <div class="colors">
        <emblem-color-menu
          .tab=${this.primaryColorTab}
          .colorsState=${this.colorsState}
          .selection=${this.getPrimaryColorSelection()}
          @tab-change=${(event: CustomEvent) =>
            (this.primaryColorTab = event.detail.tab)}
          @select=${(event: CustomEvent) =>
            this.handlePrimaryColorSelection(event)}
        >
        </emblem-color-menu>
        <emblem-color-menu
          .tab=${this.secondaryColorTab}
          .colorsState=${this.colorsState}
          .selection=${this.getSecondaryColorSelection()}
          @tab-change=${(event: CustomEvent) =>
            (this.secondaryColorTab = event.detail.tab)}
          @select=${(event: CustomEvent) =>
            this.handleSecondaryColorSelection(event)}
        >
        </emblem-color-menu>
      </div>
    `;
  }

  private renderParts(): TemplateResult {
    const parts = this.getParts();
    const groups = this.getGroups();
    if (this.tab === Tab.BACK || this.tab === Tab.FRONT) {
      return html`
        <emblem-image-menu
          .parts=${parts}
          .groups=${groups}
          .selectedGroup=${this.group}
          .selection=${this.getPartSelection()}
          @group-change=${(event: CustomEvent) => this.handleGroupChange(event)}
          @select=${(event: CustomEvent) => this.handlePartSelection(event)}
        >
        </emblem-image-menu>
      `;
    } else {
      return html`
        <emblem-word-menu
          .parts=${parts}
          .groups=${groups}
          .selectedGroup=${this.group}
          .selection=${this.getPartSelection()}
          @group-change=${(event: CustomEvent) => this.handleGroupChange(event)}
          @select=${(event: CustomEvent) => this.handlePartSelection(event)}
        >
        </emblem-word-menu>
      `;
    }
  }

  private handleGroupChange(event: CustomEvent) {
    this.group = event.detail.group;
  }

  private handlePartSelection(event: CustomEvent) {
    switch (this.tab) {
      case Tab.BACK:
        editorStore.update({ backChoice: event.detail.selection });
        break;
      case Tab.FRONT:
        editorStore.update({ frontChoice: event.detail.selection });
        break;
      case Tab.WORD_1:
        editorStore.update({ word1Choice: event.detail.selection });
        break;
      case Tab.WORD_2:
        editorStore.update({ word2Choice: event.detail.selection });
        break;
    }
  }

  private handlePrimaryColorSelection(event: CustomEvent) {
    switch (this.tab) {
      case Tab.BACK:
        editorStore.update({ backPrimaryColor: event.detail.selection });
        break;
      case Tab.FRONT:
        editorStore.update({ frontPrimaryColor: event.detail.selection });
        break;
      case Tab.WORD_1:
        editorStore.update({ word1PrimaryColor: event.detail.selection });
        break;
      case Tab.WORD_2:
        editorStore.update({ word2PrimaryColor: event.detail.selection });
        break;
    }
  }

  private handleSecondaryColorSelection(event: CustomEvent) {
    switch (this.tab) {
      case Tab.BACK:
        editorStore.update({ backSecondaryColor: event.detail.selection });
        break;
      case Tab.FRONT:
        editorStore.update({
          frontSecondaryColor: event.detail.selection,
        });
        break;
      case Tab.WORD_1:
        editorStore.update({
          word1SecondaryColor: event.detail.selection,
        });
        break;
      case Tab.WORD_2:
        editorStore.update({
          word2SecondaryColor: event.detail.selection,
        });
        break;
    }
  }

  private handleMoveBack(event: CustomEvent) {
    editorStore.update({ backPosition: event.detail });
  }

  private handleScaleBack(event: CustomEvent) {
    editorStore.update({ backScale: event.detail.scale });
  }

  private handleRotateBack(event: CustomEvent) {
    editorStore.update({ backRotation: event.detail.rotation });
  }

  private handleMoveFront(event: CustomEvent) {
    editorStore.update({ frontPosition: event.detail });
  }

  private handleScaleFront(event: CustomEvent) {
    editorStore.update({ frontScale: event.detail.scale });
  }

  private handleRotateFront(event: CustomEvent) {
    editorStore.update({ frontRotation: event.detail.rotation });
  }

  private handleMoveWord1(event: CustomEvent) {
    editorStore.update({ word1Position: event.detail });
  }

  private handleScaleWord1(event: CustomEvent) {
    editorStore.update({ word1Scale: event.detail.scale });
  }

  private handleRotateWord1(event: CustomEvent) {
    editorStore.update({ word1Rotation: event.detail.rotation });
  }

  private handleMoveWord2(event: CustomEvent) {
    editorStore.update({ word2Position: event.detail });
  }

  private handleScaleWord2(event: CustomEvent) {
    editorStore.update({ word2Scale: event.detail.scale });
  }

  private handleRotateWord2(event: CustomEvent) {
    editorStore.update({ word2Rotation: event.detail.rotation });
  }

  private getPartSelection(): string {
    switch (this.tab) {
      case Tab.BACK:
        return this.editorState?.backChoice || '';
      case Tab.FRONT:
        return this.editorState?.frontChoice || '';
      case Tab.WORD_1:
        return this.editorState?.word1Choice || '';
      case Tab.WORD_2:
        return this.editorState?.word2Choice || '';
    }
  }

  private getPrimaryColorSelection(): string {
    switch (this.tab) {
      case Tab.BACK:
        return this.editorState?.backPrimaryColor || '#000000';
      case Tab.FRONT:
        return this.editorState?.frontPrimaryColor || '#000000';
      case Tab.WORD_1:
        return this.editorState?.word1PrimaryColor || '#000000';
      case Tab.WORD_2:
        return this.editorState?.word2PrimaryColor || '#000000';
    }
  }

  private getSecondaryColorSelection(): string {
    switch (this.tab) {
      case Tab.BACK:
        return this.editorState?.backSecondaryColor || '#ffffff';
      case Tab.FRONT:
        return this.editorState?.frontSecondaryColor || '#ffffff';
      case Tab.WORD_1:
        return this.editorState?.word1SecondaryColor || '#ffffff';
      case Tab.WORD_2:
        return this.editorState?.word2SecondaryColor || '#ffffff';
    }
  }

  private getParts(): Record<string, Part> {
    let parts;
    switch (this.tab) {
      case Tab.BACK:
        parts = this.partsState?.backParts || {};
        break;
      case Tab.FRONT:
        parts = this.partsState?.frontParts || {};
        break;
      case Tab.WORD_1:
      case Tab.WORD_2:
        parts = this.partsState?.wordParts || {};
        break;
    }

    const result: Record<string, Part> = {};
    for (const key of Object.keys(parts)) {
      if (parts[key].group === this.group) {
        result[key] = parts[key];
      }
    }

    return result;
  }

  private getGroups(): PartGroupType[] {
    switch (this.tab) {
      case Tab.BACK:
        return Array.from(backGroupTypes);
      case Tab.FRONT:
        return Array.from(frontGroupTypes);
      case Tab.WORD_1:
      case Tab.WORD_2:
        return Array.from(wordGroupTypes);
    }
  }
}
