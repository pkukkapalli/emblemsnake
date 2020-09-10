import {
  LitElement,
  customElement,
  property,
  CSSResult,
  css,
  TemplateResult,
  html,
} from 'lit-element';
import { PartGroupType, groupTypeDisplayNames, Part } from '../common/parts';
import { classMap } from 'lit-html/directives/class-map';
import { buttonStyles } from './emblem-styles';

@customElement('emblem-word-menu')
export class EmblemWordMenu extends LitElement {
  @property()
  parts?: Record<string, Part>;

  @property()
  groups?: PartGroupType[];

  @property()
  selectedGroup?: PartGroupType;

  @property()
  selection?: string;

  static get styles(): CSSResult[] {
    return [
      buttonStyles,
      css`
        .container {
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          overflow: hidden;
        }

        .tabs {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          height: 3rem;
          min-width: 8rem;
        }

        .words {
          flex: 1;
          padding: 2rem;
          background: #eee;
          display: flex;
          flex-wrap: wrap;
        }

        .word-container {
          display: inline-block;
          position: relative;
          width: 50%;
          height: 3rem;
          cursor: pointer;
          box-sizing: border-box;
          border: 3px solid transparent;
          transition: border 200ms ease-in;
          z-index: 1;
        }

        @media only screen and (min-width: 600px) {
          .word-container {
            width: calc(100% / 3);
          }
        }

        @media only screen and (min-width: 1000px) {
          .word-container {
            width: 20%;
          }
        }

        .word-container:hover {
          border: 3px solid white;
        }

        .word {
          position: absolute;
          top: 0;
          left: 0;
          height: 3rem;
          z-index: 2;
          display: flex;
          align-items: center;
          margin-left: 1rem;
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
      `,
    ];
  }

  render(): TemplateResult {
    const groups = this.groups || [];
    const parts = this.parts || {};
    return html`
      <div class="container">
        <div class="tabs">
          ${groups.map(group => this.renderGroup(group))}
        </div>
        <div class="words">
          ${Object.keys(parts).map(key => this.renderWord(key, parts[key]))}
        </div>
      </div>
    `;
  }

  private renderGroup(group: PartGroupType): TemplateResult {
    return html`
      <button
        class=${classMap({ tab: true, selected: this.selectedGroup === group })}
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

  private renderWord(key: string, part: Part): TemplateResult {
    return html`
      <div
        class=${classMap({
          'word-container': true,
          selected: key === this.selection,
        })}
        @click=${() => this.dispatchEvent(this.createSelectEvent(key))}
      >
        <div class="word">${part.name}</div>
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
