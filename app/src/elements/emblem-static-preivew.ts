import { LitElement, customElement, html, css, property, TemplateResult, CSSResult } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { Part } from '../constants/parts';

@customElement('emblem-static-preview')
export class EmblemStaticPreview extends LitElement {
  @property({ type: Object })
  private part?: Part;

  static get styles(): CSSResult {
    return css`
      .preview {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    `;
  }

  render(): TemplateResult {
    const styles = styleMap({ backgroundImage: `url(${this.part?.path})` });
    return html`<div class="preview" style=${styles}></div>`;
  }
}
