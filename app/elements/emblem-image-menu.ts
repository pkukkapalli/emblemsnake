import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { PartType, Part } from '../constants/parts';

import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import './emblem-split-view';
import './emblem-static-preivew';

@customElement('emblem-image-menu')
export class EmblemImageMenu extends LitElement {
  @property({ type: String })
  private partType?: PartType;

  @property({ type: Array })
  private parts?: Part[];

  @property({ type: Object })
  private selected?: Part;

  @property({ type: String })
  private primaryColor?: string;

  @property({ type: String })
  private secondaryColor?: string;

  static get styles(): CSSResult {
    return css`
      .menu-container {
        position: relative;
        padding-bottom: 100%;
        overflow: auto;
      }

      .menu {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        max-height: 100%;
      }

      .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
      }

      @media screen and (min-width: 800px) {
        .image-container {
          width: calc(100% / 3);
        }
      }

      @media screen and (min-width: 1200px) {
        .image-container {
          width: 25%;
        }
      }

      .image-container::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .image-underlay {
        width: 95%;
        height: 95%;
        background: #252124;
        box-sizing: border-box;
        border: 3px solid transparent;
        transition: all 300ms ease-in;
        cursor: pointer;
        position: relative;
      }

      .image-underlay:hover {
        border: 3px solid #ccc;
      }

      .image {
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: contain;
      }

      .selected-icon {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #f3ff18;
        color: #252124;
        opacity: 0;
        transition: all ease-in 300ms;
      }

      .visible {
        opacity: 1;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <emblem-split-view showPreviousButton>
        <div class="menu-container">
          <div class="menu">
            ${this.parts?.map(
              (part: Part): TemplateResult => this.renderPart(part)
            )}
          </div>
        </div>
      </emblem-split-view>
    `;
  }

  private renderPart(part: Part): TemplateResult {
    const iconClasses = classMap({
      'selected-icon': true,
      visible: this.isSelectedPart(part),
    });
    return html`
      <div class="image-container">
        <div
          class="image-underlay"
          @click=${(): void => {
            this.dispatchEvent(new CustomEvent('select', { detail: { part } }));
          }}
        >
          <emblem-static-preview .part=${part}></emblem-static-preview>
          <div class="${iconClasses}">
            <iron-icon icon="done"></iron-icon>
          </div>
        </div>
      </div>
    `;
  }

  private isSelectedPart(part: Part): boolean {
    return !!this.selected && this.selected.id === part.id;
  }
}
