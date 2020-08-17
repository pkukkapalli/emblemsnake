import { customElement, LitElement, property, CSSResult, TemplateResult, css, html } from "lit-element";

import './emblem-button';

export enum Tab {
  BACK,
  FRONT,
  WORD_1,
  WORD_2,
}

const tabDisplayNames = new Map([
  [Tab.BACK, 'Back'],
  [Tab.FRONT, 'Front'],
  [Tab.WORD_1, 'Word 1'],
  [Tab.WORD_2, 'Word 2'],
]);

@customElement('emblem-tabs')
export class EmblemTabs extends LitElement {
  @property({ type: Number })
  private tab: Tab;

  constructor() {
    super();
    this.tab = Tab.BACK;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      .container {
        display: flex;
        flex-direction: row;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }

      .tab {
        display: inline-block;
        flex: 1;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        ${this.renderTab(Tab.BACK)}
        ${this.renderTab(Tab.FRONT)}
        ${this.renderTab(Tab.WORD_1)}
        ${this.renderTab(Tab.WORD_2)}
      </div>
    `;
  }

  private renderTab(tab: Tab): TemplateResult {
    if (this.tab === tab) {
      return html`
        <emblem-button
          class="tab"
          selected
          @click=${() => this.dispatchEvent(this.createTabChangeEvent(tab))}>
          ${tabDisplayNames.get(tab)}
        </emblem-button>
      `;
    } else {
      return html`
        <emblem-button
          class="tab"
          @click=${() => this.dispatchEvent(this.createTabChangeEvent(tab))}>
          ${tabDisplayNames.get(tab)}
        </emblem-button>
      `;
    }
  }

  private createTabChangeEvent(tab: Tab): CustomEvent {
    return new CustomEvent('tab-change', {
      detail: {
        tab
      }
    });
  }
}
