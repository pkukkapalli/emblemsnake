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
import { styleMap } from 'lit-html/directives/style-map';

import './emblem-split-view';
import './emblem-preview';
import { ColorPalette } from '../stores/colors-store';

// TODO: switch to a number enum
enum TabState {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

function getPrimaryColorRows(palette?: ColorPalette): string[][] {
  if (!palette) {
    return [];
  }

  const result = [];
  for (let i = 0; i < 5; i += 1) {
    result.push([
      palette.red.primary[i],
      palette.orange.primary[i],
      palette.yellow.primary[i],
      palette.green.primary[i],
      palette.cyan.primary[i],
      palette.blue.primary[i],
      palette.purple.primary[i],
      palette.pink.primary[i],
    ]);
  }
  return result;
}

function getAlternativeColorRows(palette?: ColorPalette): string[][] {
  if (!palette) {
    return [];
  }

  const result = [];
  for (let i = 0; i < 5; i += 1) {
    result.push([
      palette.red.alternative[i],
      palette.orange.alternative[i],
      palette.yellow.alternative[i],
      palette.green.alternative[i],
      palette.cyan.alternative[i],
      palette.blue.alternative[i],
      palette.purple.alternative[i],
      palette.pink.alternative[i],
    ]);
  }
  return result;
}

@customElement('emblem-color-menu')
export class EmblemColorMenu extends LitElement {
  @property({ type: Object })
  private palette?: ColorPalette;

  @property({ type: String })
  private selected?: string;

  @property({ type: String })
  private tabState: TabState;

  constructor() {
    super();
    this.tabState = TabState.FIRST;
  }

  static get styles(): CSSResult {
    return css`
      .tabs {
        display: flex;
        margin-bottom: 1rem;
      }

      .tab {
        padding: 0.5rem;
        position: relative;
        opacity: 0.5;
        cursor: pointer;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
          1px 1px 0 #000;
        margin-left: 0.5rem;
        transition: all ease-in 300ms;
      }

      .tab:hover,
      .tab-selected {
        opacity: 1;
        background: linear-gradient(
          rgba(128, 128, 128, 1),
          rgba(128, 128, 128, 0)
        );
      }

      ion-icon {
        font-size: 2rem;
      }

      .tab-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 1.5rem;
        padding-bottom: 0.5rem;
        padding-right: 0.5rem;
      }

      .color-row {
        width: 100%;
        display: flex;
        height: fit-content;
      }

      .color-container {
        width: calc(100% / 8);
        position: relative;
      }

      .color-container::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .color,
      .color-border,
      .color-selected {
        width: 85%;
        height: 85%;
        position: absolute;
        top: 0;
        left: 0;
        margin: auto;
        cursor: pointer;
        transition: all ease-in 300ms;
      }

      .color-border {
        box-sizing: border-box;
        border: 3px solid transparent;
        transition: all ease-in 300ms;
      }

      .color-border:hover {
        border: 3px solid white;
      }

      .color-selected {
        display: flex;
        justify-content: flex-end;
      }

      .selected-icon {
        background: #f3ff18;
        color: #252124;
        opacity: 0;
        transition: all ease-in 300ms;
      }

      .visible {
        opacity: 1;
      }
    `;
  }

  private renderColor(color: string): TemplateResult {
    return html`
      <div class="color-container">
        <div class="color" style=${styleMap({ backgroundColor: color })}></div>
        <div class="color-selected">
          <ion-icon
            class=${classMap({
              'selected-icon': true,
              visible: color === this.selected,
            })}
            name="checkmark-outline"
          ></ion-icon>
        </div>
        <div
          class="color-border"
          @click=${(): void => {
            this.dispatchEvent(
              new CustomEvent('select', { detail: { color } })
            );
          }}
        ></div>
      </div>
    `;
  }

  private renderColorRow(row: string[]): TemplateResult {
    return html`
      <div class="color-row">
        ${row.map(color => this.renderColor(color))}
      </div>
    `;
  }

  render(): TemplateResult {
    let grayScaleRow;
    let otherScaleRows;
    if (this.tabState === TabState.FIRST) {
      grayScaleRow = this.renderColorRow(this.palette?.gray?.primary || []);
      otherScaleRows = getPrimaryColorRows(this.palette).map(row =>
        this.renderColorRow(row)
      );
    } else {
      grayScaleRow = this.renderColorRow(this.palette?.gray?.alternative || []);
      otherScaleRows = getAlternativeColorRows(this.palette).map(row =>
        this.renderColorRow(row)
      );
    }
    return html`
      <emblem-split-view showPreviousButton>
        <div class="menu-container">
          <div class="tabs">
            <div
              class=${classMap({
                tab: true,
                'tab-selected': this.tabState === TabState.FIRST,
              })}
              @click=${(): void => {
                this.tabState = TabState.FIRST;
              }}
            >
              <ion-icon name="water"></ion-icon>
              <div class="tab-overlay">1</div>
            </div>
            <div
              class=${classMap({
                tab: true,
                'tab-selected': this.tabState === TabState.SECOND,
              })}
              @click=${(): void => {
                this.tabState = TabState.SECOND;
              }}
            >
              <ion-icon name="water"></ion-icon>
              <div class="tab-overlay">2</div>
            </div>
          </div>
          <div class="menu">
            ${grayScaleRow} ${otherScaleRows}
          </div>
        </div>
      </emblem-split-view>
    `;
  }
}
