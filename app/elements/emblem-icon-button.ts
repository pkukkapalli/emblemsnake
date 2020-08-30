import {
  LitElement,
  customElement,
  property,
  CSSResult,
  css,
  TemplateResult,
  html,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

export enum IconSize {
  SMALL,
  NORMAL,
}

@customElement('emblem-icon-button')
export class EmblemIconButton extends LitElement {
  @property({ type: Number })
  private size = IconSize.NORMAL;

  static get styles(): CSSResult {
    return css`
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 3rem;
        border: none;
        border-radius: 50%;
        transition: all 200ms ease-in;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        background: lightgray;
        cursor: pointer;
      }

      .small {
        width: 0.5rem;
        height: 0.5rem;
      }

      button:hover {
        background: #eee;
      }

      button:focus {
        outline: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <button class=${classMap({ small: this.size === IconSize.SMALL })}>
        <slot></slot>
      </button>
    `;
  }
}
