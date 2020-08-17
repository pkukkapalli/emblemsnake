import {LitElement, html, customElement, property, TemplateResult, CSSResult, css, internalProperty} from 'lit-element';
import { PartsStore, PartsState } from '../stores/parts-store';
import { Part, backGroupTypes, PartGroupType, frontGroupTypes, wordGroupTypes } from '../constants/parts';
import { ColorsStore, ColorsState } from '../stores/colors-store';
import { Tab } from './emblem-tabs';
import { Tab as ColorTab } from './emblem-color-menu';
import './emblem-image-menu';
import './emblem-word-menu';
import './emblem-preview';
import { EditorState, EditorStore } from '../stores/editor-store';

const defaultGroupForTab = new Map([
  [Tab.BACK, PartGroupType.BACK_NORMAL],
  [Tab.FRONT, PartGroupType.FRONT_NORMAL],
  [Tab.WORD_1, PartGroupType.WORD_NUMBER],
  [Tab.WORD_2, PartGroupType.WORD_NUMBER],
]);

@customElement('emblem-app')
export class EmblemApp extends LitElement {
  private readonly partsStore: PartsStore;
  private readonly colorsStore: ColorsStore;
  private readonly editorStore: EditorStore;

  @property()
  partsState?: PartsState;

  @property()
  colorsState?: ColorsState;

  @property()
  editorState?: EditorState;

  @internalProperty()
  private tab = Tab.BACK;

  @internalProperty()
  private group = defaultGroupForTab.get(Tab.BACK);

  @internalProperty()
  private primaryColorTab = ColorTab.MAIN;
  
  @internalProperty()
  private secondaryColorTab = ColorTab.MAIN;

  constructor() {
    super();
    this.partsStore = new PartsStore(state => {
      this.partsState = state;
    });
    this.colorsStore = new ColorsStore(state => {
      this.colorsState = state;
    });
    this.editorStore = new EditorStore(state => {
      this.editorState = state;
    });
  }

  static get styles(): CSSResult {
    return css`
      .container {
        display: flex;
        flex-direction: row;
        height: 100%;
      }

      .menu {
        flex: 6;
        height: 100%;
        background: lightgray;
        overflow: auto;
        padding: 1rem;
        box-sizing: border-box;
      }

      emblem-tabs {
        margin-bottom: 4rem;
      }

      .colors {
        display: flex;
        flex-direction: row;
        margin-bottom: 4rem;
      }

      emblem-color-menu {
        flex: 1;
      }

      emblem-color-menu:not(:first-child) {
        margin-inline-start: 1rem;
      }

      emblem-preview {
        flex: 4;
        height: 100%;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.partsStore.connect();
    this.colorsStore.connect();
    this.editorStore.connect();
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <emblem-preview
          .backChoice=${this.getBackChoice()}
          .frontChoice=${this.getFrontChoice()}
          .word1Choice=${this.getWord1Choice()}
          .word2Choice=${this.getWord2Choice()}>
        </emblem-preview>
        <div class="menu">
          ${this.renderTabs()}
          ${this.renderColors()}
          ${this.renderParts()}
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
      <emblem-tabs
        .tab=${this.tab}
        @tab-change=${(event: CustomEvent) => this.handleTabChange(event.detail.tab)}>
      </emblem-tabs>
    `;
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
          @tab-change=${(event: CustomEvent) => this.primaryColorTab = event.detail.tab}
          @select=${(event: CustomEvent) => this.handlePrimaryColorSelection(event)}>
        </emblem-color-menu>
        <emblem-color-menu
          .tab=${this.secondaryColorTab}
          .colorsState=${this.colorsState}
          .selection=${this.getSecondaryColorSelection()}
          @tab-change=${(event: CustomEvent) => this.secondaryColorTab = event.detail.tab}
          @select=${(event: CustomEvent) => this.handleSecondaryColorSelection(event)}>
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
          @select=${(event: CustomEvent) => this.handlePartSelection(event)}>
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
          @select=${(event: CustomEvent) => this.handlePartSelection(event)}>
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
        this.editorStore.update({ backChoice: event.detail.selection });
        break;
      case Tab.FRONT:
        this.editorStore.update({ frontChoice: event.detail.selection });
        break;
      case Tab.WORD_1:
        this.editorStore.update({ word1Choice: event.detail.selection });
        break;
      case Tab.WORD_2:
        this.editorStore.update({ word2Choice: event.detail.selection });
        break;
    }
  }

  private handlePrimaryColorSelection(event: CustomEvent) {
    switch (this.tab) {
      case Tab.BACK:
        this.editorStore.update({ backPrimaryColor: event.detail.selection });
        break;
      case Tab.FRONT:
        this.editorStore.update({ frontPrimaryColor: event.detail.selection });
        break;
      case Tab.WORD_1:
        this.editorStore.update({ word1PrimaryColor: event.detail.selection });
        break;
      case Tab.WORD_2:
        this.editorStore.update({ word2PrimaryColor: event.detail.selection });
        break;
    }
  }

  private handleSecondaryColorSelection(event: CustomEvent) {
    switch (this.tab) {
      case Tab.BACK:
        this.editorStore.update({ backSecondaryColor: event.detail.selection });
        break;
      case Tab.FRONT:
        this.editorStore.update({ frontSecondaryColor: event.detail.selection });
        break;
      case Tab.WORD_1:
        this.editorStore.update({ word1SecondaryColor: event.detail.selection });
        break;
      case Tab.WORD_2:
        this.editorStore.update({ word2SecondaryColor: event.detail.selection });
        break;
    }
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
        return this.editorState?.backPrimaryColor || '#000';
      case Tab.FRONT:
        return this.editorState?.frontPrimaryColor || '#000';
      case Tab.WORD_1:
        return this.editorState?.word1PrimaryColor || '#000';
      case Tab.WORD_2:
        return this.editorState?.word2PrimaryColor || '#000';
    }
  }

  private getSecondaryColorSelection(): string {
    switch (this.tab) {
      case Tab.BACK:
        return this.editorState?.backSecondaryColor || '#fff';
      case Tab.FRONT:
        return this.editorState?.frontSecondaryColor || '#fff';
      case Tab.WORD_1:
        return this.editorState?.word1SecondaryColor || '#fff';
      case Tab.WORD_2:
        return this.editorState?.word2SecondaryColor || '#fff';
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
