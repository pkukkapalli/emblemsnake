import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { partTypeDisplayNames, PartType, Part } from '../constants/parts';
import { PartActionType, calculateRoute } from '../constants/routes';

import './emblem-split-view';
import './emblem-preview';

@customElement('emblem-sub-menu')
export class EmblemSubMenu extends LitElement {
  @property({ type: String })
  private partType?: PartType;

  @property({ type: Object })
  private choice?: Part;

  @property({ type: String })
  private primaryColor?: string;

  @property({ type: String })
  private secondaryColor?: string;

  static get styles(): CSSResult {
    return css`
      .part-title {
        font-size: 1.5rem;
        width: 65%;
        margin: auto;
      }

      .options {
        display: flex;
        flex-wrap: wrap;
        width: 70%;
        margin: auto;
      }

      @media screen and (min-width: 1200px) {
        .part-title {
          width: 45%;
        }

        .options {
          width: 50%;
        }
      }

      .option {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
      }

      .option::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .option-button {
        width: 90%;
        height: 90%;
        box-sizing: border-box;
        transition: all 300ms ease-in;
        position: relative;
        background: #252124;
        border: 3px solid transparent;
      }

      .option-button:hover {
        width: 100%;
        height: 100%;
        border: 3px solid #cccccc;
      }

      .color {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .primary-color {
        width: 50%;
        height: 50%;
        border-radius: 3px;
      }

      .secondary-color {
        width: 50%;
        height: 50%;
        border-radius: 3px;
      }

      .color-icon {
        width: 1.5rem;
        height: 1.5rem;
        color: #252124;
      }
    `;
  }

  render(): TemplateResult {
    if (!this.partType) {
      throw new Error('emblem-sub-menu must have partType set');
    }
    return html`
      <emblem-split-view showPreviousButton>
        <div>
          <div class="part-title">
            ${partTypeDisplayNames.get(this.partType)}
          </div>
          <div class="options">
            ${this.renderOptionTemplate(PartActionType.CHOOSE)}
            ${this.renderOptionTemplate(PartActionType.ADJUST)}
            ${this.renderOptionTemplate(PartActionType.PRIMARY_COLOR)}
            ${this.renderOptionTemplate(PartActionType.SECONDARY_COLOR)}
          </div>
        </div>
      </emblem-split-view>
    `;
  }

  private renderOptionTemplate(partActionType: PartActionType): TemplateResult {
    const route = calculateRoute(this.partType, partActionType);
    switch (partActionType) {
      case PartActionType.CHOOSE:
        return html`
          <div class="option">
            <a class="option-button" href=${route}>
              ${this.renderPreview()}
            </a>
          </div>
        `;
      case PartActionType.ADJUST:
        return html`
          <div class="option">
            <a class="option-button" href=${route}></a>
          </div>
        `;
      case PartActionType.PRIMARY_COLOR:
        return html`
          <div class="option">
            <a class="option-button" href=${route}>
              <div class="color">
                <div
                  class="primary-color"
                  style=${styleMap({
                    background: this.primaryColor || 'black',
                  })}
                >
                  <ion-icon class="color-icon" name="water"></ion-icon>
                </div>
              </div>
            </a>
          </div>
        `;
      case PartActionType.SECONDARY_COLOR:
        return html`
          <div class="option">
            <a class="option-button" href=${route}>
              <div class="color">
                <div
                  class="secondary-color"
                  style=${styleMap({
                    border: `3px solid ${this.secondaryColor}`,
                  })}
                >
                  <ion-icon
                    class="color-icon"
                    name="water"
                    style=${styleMap({
                      background: this.secondaryColor || 'white',
                    })}
                  ></ion-icon>
                </div>
              </div>
            </a>
          </div>
        `;
      default:
        throw new Error(`unknown PartActionType ${partActionType}`);
    }
  }

  private renderPreview(): TemplateResult {
    switch (this.partType) {
      case PartType.BACK:
        return html`
          <emblem-preview .backChoice=${this.choice}></emblem-preview>
        `;
      case PartType.FRONT:
        return html`
          <emblem-preview .frontChoice=${this.choice}></emblem-preview>
        `;
      case PartType.WORD_1:
        return html`
          <emblem-preview .word1Choice=${this.choice}></emblem-preview>
        `;
      case PartType.WORD_2:
        return html`
          <emblem-preview .word2Choice=${this.choice}></emblem-preview>
        `;
      default:
        throw new Error(`unknown PartType ${this.partType}`);
    }
  }
}
