import {
  LitElement,
  customElement,
  property,
  TemplateResult,
  html,
  CSSResult,
  css,
} from 'lit-element';
import { PartGroupType, Part, groupTypeDisplayNames } from '../constants/parts';
import './emblem-button';
import { classMap } from 'lit-html/directives/class-map';

@customElement('emblem-image-menu')
export class EmblemImageMenu extends LitElement {
  @property()
  parts?: Record<string, Part>;

  @property()
  groups?: PartGroupType[];

  @property()
  selectedGroup?: PartGroupType;

  @property()
  selection?: string;

  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      }

      .tabs {
        display: flex;
        flex-direction: row;
      }

      .tab {
        flex: 1;
        height: 3rem;
      }

      .images {
        flex: 1;
        background: #eee;
        display: flex;
        flex-wrap: wrap;
      }

      @media only screen and (min-width: 1000px) {
        .images {
          padding: 2rem;
        }
      }

      .image-container {
        display: inline-block;
        position: relative;
        width: calc(100% / 4);
        cursor: pointer;
        box-sizing: border-box;
        border: 3px solid transparent;
        transition: border 200ms ease-in;
        z-index: 1;
      }

      @media only screen and (min-width: 600px) {
        .image-container {
          width: calc(100% / 6);
        }
      }

      .image-container:hover {
        border: 3px solid white;
      }

      .image-container::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .image {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        z-index: 2;
      }

      .check {
        opacity: 0;
        position: absolute;
        top: 0rem;
        right: 0rem;
        z-index: 3;
        background: gold;
      }

      .selected > .check {
        opacity: 1;
      }
    `;
  }

  render(): TemplateResult {
    const groups = this.groups || [];
    const parts = this.parts || {};
    return html`
      <div class="tabs">
        ${groups.map(group => this.renderGroup(group))}
      </div>
      <div class="images">
        ${Object.keys(parts).map(key => this.renderImage(key, parts[key]))}
      </div>
    `;
  }

  private renderGroup(group: PartGroupType): TemplateResult {
    return html`
      <emblem-button
        class="tab"
        .selected=${group === this.selectedGroup}
        @click=${() => this.dispatchEvent(this.createGroupChangeEvent(group))}
      >
        ${groupTypeDisplayNames.get(group)}
      </emblem-button>
    `;
  }

  private createGroupChangeEvent(group: PartGroupType): CustomEvent {
    return new CustomEvent('group-change', {
      detail: {
        group,
      },
    });
  }

  private renderImage(key: string, part: Part): TemplateResult {
    return html`
      <div
        class=${classMap({
          'image-container': true,
          selected: key === this.selection,
        })}
        @click=${() => this.dispatchEvent(this.createSelectEvent(key))}
      >
        <img class="image" src=${part.path} />
        <img class="check" src="/assets/check.svg" />
      </div>
    `;
  }

  private createSelectEvent(selection: string) {
    return new CustomEvent('select', {
      detail: {
        selection,
      },
    });
  }
}
