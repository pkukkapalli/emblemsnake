import {
  customElement,
  LitElement,
  CSSResult,
  css,
  TemplateResult,
  html,
  property,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('emblem-button')
export class EmblemButton extends LitElement {
  @property({ type: Boolean })
  private selected = false;

  static get styles(): CSSResult {
    return css`
      button {
        width: 100%;
        height: 3rem;
        border: none;
        text-transform: uppercase;
        cursor: pointer;
        font-weight: bold;
        transition: all 200ms ease-in;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        background: lightgray;
        cursor: pointer;
      }

      button:hover,
      button.selected {
        background: #eee;
      }

      button:focus {
        outline: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <button class=${classMap({ selected: this.selected })}>
        <slot></slot>
      </button>
    `;
  }
}
