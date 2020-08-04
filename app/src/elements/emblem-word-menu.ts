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

import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import './emblem-split-view';
import './emblem-preview';
import { Part } from '../constants/parts';

@customElement('emblem-word-menu')
export class EmblemWordMenu extends LitElement {
  @property({ type: Array })
  private parts?: Part[];

  @property({ type: Object })
  private selected?: Part;

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
        max-height: 100%;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        padding-left: 1rem;
        box-sizing: border-box;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
      }

      .item:hover {
        background: #ccc;
        color: #252124;
      }

      .selected-icon {
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
    // TODO: Fix jank when hitting back button on this view.
    return html`
      <emblem-split-view showPreviousButton>
        <div class="menu-container">
          <div class="menu">
            ${this.parts?.map(part => this.renderPart(part))}
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
      <div
        class="item"
        @click=${(): void => {
          this.dispatchEvent(new CustomEvent('select', { detail: { part } }));
        }}
      >
        <span>${part.name}</span>
        <div class="${iconClasses}">
          <iron-icon icon="done"></iron-icon>
        </div>
      </div>
    `;
  }

  private isSelectedPart(part: Part): boolean {
    return !!this.selected && this.selected.name === part.name;
  }
}
