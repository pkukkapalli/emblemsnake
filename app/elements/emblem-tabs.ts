import {
  customElement,
  LitElement,
  property,
  CSSResult,
  TemplateResult,
  css,
  html,
} from 'lit-element';
import { buttonStyles } from './emblem-styles';
import { classMap } from 'lit-html/directives/class-map';

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

  static get styles(): CSSResult[] {
    return [
      buttonStyles,
      css`
        :host {
          display: block;
        }

        .container {
          display: flex;
          flex-direction: row;
        }

        .tab {
          display: inline-block;
          flex: 1;
          min-width: 8rem;
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        ${this.renderTab(Tab.BACK)} ${this.renderTab(Tab.FRONT)}
        ${this.renderTab(Tab.WORD_1)} ${this.renderTab(Tab.WORD_2)}
      </div>
    `;
  }

  private renderTab(tab: Tab): TemplateResult {
    return html`
      <button
        class=${classMap({ tab: true, selected: this.tab === tab })}
        @click=${() => this.dispatchEvent(this.createTabChangeEvent(tab))}
      >
        ${tabDisplayNames.get(tab)}
      </button>
    `;
  }

  private createTabChangeEvent(tab: Tab): CustomEvent {
    return new CustomEvent('tab-change', {
      detail: {
        tab,
      },
    });
  }
}
