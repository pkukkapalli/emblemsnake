import {
  customElement,
  LitElement,
  property,
  CSSResult,
  css,
  TemplateResult,
  html,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';
import { buttonStyles } from './emblem-styles';
import { ColorsState } from '../common/colors';

export enum Tab {
  MAIN,
  ALTERNATE,
}

const tabDisplayNames = new Map([
  [Tab.MAIN, 'Main'],
  [Tab.ALTERNATE, 'Alternate'],
]);

@customElement('emblem-color-menu')
export class EmblemColorMenu extends LitElement {
  @property()
  colorsState?: ColorsState;

  @property()
  tab = Tab.MAIN;

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
          overflow-x: hidden;
        }

        .tabs {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          height: 3rem;
        }

        .colors {
          flex: 1;
          background: #eee;
        }

        .row {
          display: flex;
          flex-direction: row;
        }

        .color {
          flex: 1;
          box-sizing: border-box;
          border: 3px solid transparent;
          transition: all 200ms ease-in;
          cursor: pointer;
          position: relative;
        }

        .color:hover {
          border: 3px solid white;
        }

        .color::after {
          content: '';
          display: block;
          padding-bottom: 100%;
        }

        .check {
          position: absolute;
          top: 0;
          right: 0;
          opacity: 0;
          background: gold;
        }

        .color.selected > .check {
          opacity: 1;
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="tabs">
          ${this.renderTab(Tab.MAIN)} ${this.renderTab(Tab.ALTERNATE)}
        </div>
        <div class="colors">
          ${this.renderGrayscaleRow()} ${this.renderCrossColorRow(0)}
          ${this.renderCrossColorRow(1)} ${this.renderCrossColorRow(2)}
          ${this.renderCrossColorRow(3)} ${this.renderCrossColorRow(4)}
        </div>
      </div>
    `;
  }

  private renderGrayscaleRow(): TemplateResult {
    let colors: string[];
    switch (this.tab) {
      case Tab.MAIN:
        colors = this.colorsState?.grayscale || [];
        break;
      case Tab.ALTERNATE:
        colors = this.colorsState?.grayscaleAlternative || [];
        break;
    }

    return this.renderColorRow(colors);
  }

  private renderCrossColorRow(index: number): TemplateResult {
    if (
      !this.colorsState ||
      this.colorsState.isLoading ||
      this.colorsState.error
    ) {
      return html`<div></div>`;
    }

    let colors: string[];
    switch (this.tab) {
      case Tab.MAIN:
        colors = [
          this.colorsState.purplescale[index],
          this.colorsState.pinkscale[index],
          this.colorsState.bluescale[index],
          this.colorsState.cyanscale[index],
          this.colorsState.greenscale[index],
          this.colorsState.orangescale[index],
          this.colorsState.yellowscale[index],
          this.colorsState.redscale[index],
        ];
        break;
      case Tab.ALTERNATE:
        colors = [
          this.colorsState.purplescaleAlternative[index],
          this.colorsState.pinkscaleAlternative[index],
          this.colorsState.bluescaleAlternative[index],
          this.colorsState.cyanscaleAlternative[index],
          this.colorsState.greenscaleAlternative[index],
          this.colorsState.orangescaleAlternative[index],
          this.colorsState.yellowscaleAlternative[index],
          this.colorsState.redscaleAlternative[index],
        ];
        break;
    }

    return this.renderColorRow(colors);
  }

  private renderColorRow(colors: string[]): TemplateResult {
    return html`
      <div class="row">
        ${colors.map(color => this.renderColor(color))}
      </div>
    `;
  }

  private renderColor(color: string): TemplateResult {
    return html`
      <div
        class=${classMap({
          color: true,
          selected: color.toLowerCase() === this.selection?.toLowerCase(),
        })}
        style=${styleMap({ backgroundColor: color })}
        @click=${() => this.dispatchEvent(this.createSelectEvent(color))}
      >
        <img class="check" src="/assets/check.svg" />
      </div>
    `;
  }

  private createSelectEvent(selection: string): CustomEvent {
    return new CustomEvent('select', {
      detail: {
        selection,
      },
    });
  }

  private renderTab(tab: Tab): TemplateResult {
    return html`
      <button
        class=${classMap({ tab: true, selected: this.tab === tab })}
        @click=${() => this.dispatchEvent(this.createTabChangeEvent(tab))}
      >
        ${tabDisplayNames.get(tab)}
      </button>
    `;
  }

  private createTabChangeEvent(tab: Tab): CustomEvent {
    return new CustomEvent('tab-change', {
      detail: {
        tab,
      },
    });
  }
}
