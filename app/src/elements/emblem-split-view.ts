import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
} from 'lit-element';

import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import { TemplateResult } from 'lit-html';

// TODO: replace with number enum
enum SplitView {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

function renderHalfTemplate(
  header: TemplateResult,
  body: TemplateResult
): TemplateResult {
  return html`
    <div class="half">
      <div class="column">
        <div class="header">${header}</div>
        ${body}
        <div class="footer"></div>
      </div>
    </div>
  `;
}

// TODO: Handle resizing screen while on right view. Specifically, resizing from mobile to desktop width.
@customElement('emblem-split-view')
export class EmblemSplitView extends LitElement {
  @property({ type: Boolean })
  private showPreviousButton: boolean;

  @property({ type: String })
  private splitState: SplitView;

  constructor() {
    super();
    this.showPreviousButton = false;
    this.splitState = SplitView.LEFT;
  }

  static get styles(): CSSResult {
    return css`
      .container {
        background: radial-gradient(#787576, #141013);
        width: 100%;
        height: 100%;
        overflow-x: hidden;
      }

      .whole {
        display: flex;
        width: 200%;
        min-height: 100%;
        transition: transform 300ms ease-in;
      }

      @media screen and (min-width: 800px) {
        .whole {
          width: 100%;
        }
      }

      .half {
        width: 100%;
      }

      .column {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 70%;
        height: 100%;
        margin: auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 95%;
        margin: 2rem auto;
      }

      .logo {
        font-family: 'Nanum Gothic Coding', monospace;
        color: #c8821b;
        text-transform: uppercase;
        font-size: 1.2rem;
      }

      paper-button {
        line-height: 0;
      }

      iron-icon {
        font-size: 1rem;
      }

      @media screen and (min-width: 800px) {
        .nav-option {
          display: none;
        }
      }

      .preview-sizer {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
      }

      .preview-sizer::after {
        content: '';
        display: block;
      }

      emblem-preview {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  updated(changedProperties: Map<string, SplitView>): void {
    const whole = this.shadowRoot?.getElementById('whole');
    if (!whole || !changedProperties.has('currentView')) {
      return;
    }

    switch (this.splitState) {
      case SplitView.LEFT:
        whole.style.transform = 'translate(0%)';
        break;
      case SplitView.RIGHT:
        whole.style.transform = 'translate(-50%)';
        break;
      default:
        throw new Error(`unknown SplitState ${this.splitState}`);
    }
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="whole" id="whole">
          ${renderHalfTemplate(
            html`
              ${this.renderTopBar()}
              <paper-icon-button
                icon="visibility"
                class="nav-option"
                @click=${(): void => this.goRight()}
              ></paper-icon-button>
            `,
            html` <slot></slot> `
          )}
          ${renderHalfTemplate(
            html`
              <paper-icon-button
                icon="chevron-left"
                class="nav-option"
                @click=${(): void => this.goLeft()}
              ></paper-icon-button>
            `,
            html`
              <div class="preview-container">
                <div class="preview-label">Emblem</div>
                <div class="preview-sizer">
                  <emblem-preview></emblem-preview>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderTopBar(): TemplateResult {
    // TODO: Make the previous button go to the correct view if the
    // previous history entry does not match.
    if (this.showPreviousButton) {
      return html`
        <paper-button @click=${(): void => window.history.back()}>
          <iron-icon icon="chevron-left"></iron-icon>
          <span>Prev</span>
        </paper-button>
      `;
    }
    return html` <div class="logo">Emblem Snake</div> `;
  }

  private goLeft(): void {
    this.splitState = SplitView.LEFT;
    this.requestUpdate('currentView', SplitView.RIGHT);
  }

  private goRight(): void {
    this.splitState = SplitView.RIGHT;
    this.requestUpdate('currentView', SplitView.LEFT);
  }
}
