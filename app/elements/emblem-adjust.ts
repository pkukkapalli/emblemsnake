import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
} from 'lit-element';

import './emblem-split-view';

@customElement('emblem-adjust')
export class EmblemAdjust extends LitElement {
  static get styles(): CSSResult {
    return css`
      .container {
        background: radial-gradient(#787576, #141013);
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .preview-label,
      .preview-container {
        width: 90%;
      }

      .preview-container {
        position: relative;
      }

      .preview-container::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      @media screen and (min-width: 800px) {
        .preview-label,
        .preview-container {
          width: 40%;
        }
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

  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="preview-label">Emblem</div>
        <div class="preview-container">
          <emblem-preview></emblem-preview>
        </div>
      </div>
    `;
  }
}
