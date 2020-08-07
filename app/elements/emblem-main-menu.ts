import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { PartType, partTypeDisplayNames, Part } from '../constants/parts';
import { calculateRoute } from '../constants/routes';

import './emblem-static-preivew';
import './emblem-split-view';
import './emblem-preview';

@customElement('emblem-main-menu')
export class EmblemMainMenu extends LitElement {
  @property({ type: Object })
  private backChoice?: Part;

  // TODO: replace colors with semantic types
  @property({ type: String })
  private backPrimaryColor?: string;

  @property({ type: String })
  private backSecondaryColor?: string;

  @property({ type: Object })
  private frontChoice?: Part;

  @property({ type: String })
  private frontPrimaryColor?: string;

  @property({ type: String })
  private frontSecondaryColor?: string;

  @property({ type: Object })
  private word1Choice?: Part;

  @property({ type: String })
  private word1PrimaryColor?: string;

  @property({ type: String })
  private word1SecondaryColor?: string;

  @property({ type: Object })
  private word2Choice?: Part;

  @property({ type: String })
  private word2PrimaryColor?: string;

  @property({ type: String })
  private word2SecondaryColor?: string;

  static get styles(): CSSResult {
    return css`
      .options {
        display: flex;
        flex-wrap: wrap;
      }

      .option {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .option::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .option-button {
        color: inherit;
        text-decoration: none;
        background: #252124;
        width: 90%;
        height: 90%;
        cursor: pointer;
        transition: all 300ms ease-in;
        box-sizing: border-box;
        border: 3px solid transparent;
        display: flex;
        flex-direction: column;
      }

      .option-button:hover {
        width: 100%;
        height: 100%;
        border: 3px solid #ccc;
      }

      .option-button-header {
        background: #0f0c0e;
        text-align: center;
        font-size: 1rem;
        padding: 0.4rem;
      }

      .option-button emblem-static-preview {
        width: 100%;
        flex: 1;
      }

      @media screen and (min-width: 1200px) {
        .option-button-header {
          font-size: 1.5rem;
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <emblem-split-view>
        <div class="options">
          ${this.renderOptionTemplate(PartType.BACK)}
          ${this.renderOptionTemplate(PartType.FRONT)}
          ${this.renderOptionTemplate(PartType.WORD_1)}
          ${this.renderOptionTemplate(PartType.WORD_2)}
        </div>
      </emblem-split-view>
    `;
  }

  private renderOptionTemplate(partType: PartType): TemplateResult {
    let preview;
    switch (partType) {
      case PartType.BACK:
        preview = html`
          <emblem-static-preview .part=${this.backChoice}></emblem-static-preview>
        `;
        break;
      case PartType.FRONT:
        preview = html`
          <emblem-static-preview .part=${this.frontChoice}></emblem-static-preview>
        `;
        break;
      case PartType.WORD_1:
        preview = html`
          <emblem-preview
            .word1Choice=${this.word1Choice}
            .word1PrimaryColor=${this.word1PrimaryColor}
            .word1SecondaryColor=${this.word1SecondaryColor}
          ></emblem-preview>
        `;
        break;
      case PartType.WORD_2:
        preview = html`
          <emblem-preview
            .word2Choice=${this.word2Choice}
            .word2PrimaryColor=${this.word2PrimaryColor}
            .word2SecondaryColor=${this.word2SecondaryColor}
          ></emblem-preview>
        `;
        break;
      default:
        preview = '';
    }

    return html`
      <div class="option">
        <a class="option-button" href="${calculateRoute(partType)}">
          <div class="option-button-header">
            ${partTypeDisplayNames.get(partType)}
          </div>
          ${preview}
        </a>
      </div>
    `;
  }
}
