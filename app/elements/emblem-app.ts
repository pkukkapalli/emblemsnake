import {LitElement, html, customElement, property, TemplateResult, CSSResult, css} from 'lit-element';
import { PartsStore, PartsState } from '../stores/parts-store';
import { classMap } from 'lit-html/directives/class-map';
import { Part, backGroupTypes, PartGroupType, groupTypeDisplayNames, frontGroupTypes, wordGroupTypes } from '../constants/parts';
import { styleMap } from 'lit-html/directives/style-map';

enum Tab {
  BACK = 0,
  FRONT = 1,
  WORD_1 = 2,
  WORD_2 = 3,
}

const tabDisplayNames = new Map([
  [Tab.BACK, 'Back'],
  [Tab.FRONT, 'Front'],
  [Tab.WORD_1, 'Word 1'],
  [Tab.WORD_2, 'Word 2'],
]);

const tabDefaultGroups = new Map([
  [Tab.BACK, PartGroupType.BACK_NORMAL],
  [Tab.FRONT, PartGroupType.FRONT_NORMAL],
  [Tab.WORD_1, PartGroupType.WORD_NUMBER],
  [Tab.WORD_2, PartGroupType.WORD_NUMBER],
]);

@customElement('emblem-app')
export class EmblemApp extends LitElement {
  private readonly partsStore: PartsStore;

  @property({ type: Object })
  private partsState?: PartsState;

  @property({ type: Number })
  private tab: Tab;

  @property({ type: String })
  private group: PartGroupType;

  @property({ type: String })
  private backChoice: string;

  @property({ type: String })
  private frontChoice: string;

  @property({ type: String })
  private word1Choice: string;

  @property({ type: String })
  private word2Choice: string;

  constructor() {
    super();

    this.partsStore = new PartsStore(state => {
      this.partsState = state;
    });

    this.tab = Tab.BACK;
    this.group = PartGroupType.BACK_NORMAL;
    this.backChoice = '';
    this.frontChoice = '';
    this.word1Choice = '';
    this.word2Choice = '';
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

      .tabs {
        margin-bottom: 4rem;
        display: flex;
        flex-direction: row;
      }

      button {
        width: 10rem;
        height: 3rem;
        border: none;
        text-transform: uppercase;
        cursor: pointer;
        font-weight: bold;
        transition: all 200ms ease-in;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        background: transparent;
      }

      button:hover, button.selected {
        background: #eee;
        font-weight: bold;
      }

      button:focus {
        outline: none;
      }

      .parts-container {
        display: flex;
        flex-direction: row;
      }

      .groups {
        display: flex;
        flex-direction: column;
      }

      .parts {
        height: 100%;
        margin: auto;
        background: #eee;
      }

      .part-image {
        display: inline-block;
        width: 150px;
        height: 150px;
        background-position: center;
        background-size: cover;
        cursor: pointer;
        box-sizing: border-box;
        border: 3px solid transparent;
      }

      .part-image:hover {
        border: 3px solid #fff;
      }

      .preview {
        flex: 4;
        height: 100%;
        background: black;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.partsStore.connect();
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="menu">
          ${this.renderTabs()}
          ${this.renderParts()}
        </div>
        <div class="preview">

        </div>
      </div>
    `;
  }

  private renderTabs(): TemplateResult {
    return html`
      <div class="tabs">
        ${this.renderTab(Tab.BACK)}
        ${this.renderTab(Tab.FRONT)}
        ${this.renderTab(Tab.WORD_1)}
        ${this.renderTab(Tab.WORD_2)}
      </div>
    `;
  }

  private renderTab(tab: Tab): TemplateResult {
    return html`
      <button 
        class="${classMap({
          'selected': this.tab === tab 
        })}"
        @click=${() => {
          this.tab = tab;
          this.group = tabDefaultGroups.get(tab) || PartGroupType.BACK_NORMAL;
        }}>
        ${tabDisplayNames.get(tab)}
      </button>
    `;
  }

  private renderParts(): TemplateResult {
    const parts = this.getParts();
    const groups = this.getGroups();
    return html`
      <div class="parts-container">
        <div class="groups">
          ${Array.from(groups).map(group => this.renderGroup(group))}
        </div>
        <div class="parts">
          ${Object.keys(parts).map(key => {
            const part = parts[key];
            return this.renderPart(key, part);
          })}
        </div>
      </div>
    `;
  }

  private renderGroup(group: PartGroupType): TemplateResult {
    return html`
      <button
        class=${classMap({
          'selected': this.group === group
        })}
        @click=${() => this.group = group}>
        ${groupTypeDisplayNames.get(group)}
      </button>
    `;
  }

  private renderPart(key: string, part: Part): TemplateResult {
    const choices = new Set([
      this.backChoice,
      this.frontChoice,
      this.word1Choice,
      this.word2Choice,
    ]);
    return html`
      <div
        style=${styleMap({
          backgroundImage: `url('${part.path}')`
        })}
        class="part-image">
        <div
          class=${classMap({
            'part-image-overlay': true,
            'selected': choices.has(key),
          })}>
        </div>
      </div>
    `;
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

  private getGroups(): Set<PartGroupType> {
    switch (this.tab) {
      case Tab.BACK:
        return backGroupTypes;
      case Tab.FRONT:
        return frontGroupTypes;
      case Tab.WORD_1:
      case Tab.WORD_2:
        return wordGroupTypes;
    }
  }
}
