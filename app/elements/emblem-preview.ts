import {
  LitElement,
  customElement,
  property,
  CSSResult,
  css,
  TemplateResult,
  html,
  internalProperty,
} from 'lit-element';
import { Part } from '../constants/parts';
import { Tab } from './emblem-tabs';
import { styleMap } from 'lit-html/directives/style-map';
import { PartPosition } from '../stores/editor-store';
import { drawPart } from '../services/draw-service';
import './emblem-icon-button';
import { download } from '../services/download-service';

const STANDARD_POSITION_DIFF = 5;
const DEFAULT_POSITION = { x: 0, y: 0 };
const STANDARD_SCALE_DIFF = 0.1;

enum MoveDirection {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

enum ScaleMode {
  UP,
  DOWN,
}

@customElement('emblem-preview')
export class EmblemPreview extends LitElement {
  @property()
  tab?: Tab;

  @property()
  backChoice?: Part;
  @property()
  backPrimaryColor?: string;
  @property()
  backSecondaryColor?: string;
  @property()
  backPosition?: PartPosition;
  @property()
  backScale?: number;

  @property()
  frontChoice?: Part;
  @property()
  frontPrimaryColor?: string;
  @property()
  frontSecondaryColor?: string;
  @property()
  frontPosition?: PartPosition;
  @property()
  frontScale?: number;

  @property()
  word1Choice?: Part;
  @property()
  word1PrimaryColor?: string;
  @property()
  word1SecondaryColor?: string;
  @property()
  word1Position?: PartPosition;
  @property()
  word1Scale?: number;

  @property()
  word2Choice?: Part;
  @property()
  word2PrimaryColor?: string;
  @property()
  word2SecondaryColor?: string;
  @property()
  word2Position?: PartPosition;
  @property()
  word2Scale?: number;

  @internalProperty()
  width?: number;
  @internalProperty()
  height?: number;

  static get styles(): CSSResult {
    return css`
      :host {
        position: relative;
      }

      .container {
        position: relative;
        background: black;
        height: 100%;
        box-sizing: border-box;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
          0 10px 10px rgba(0, 0, 0, 0.22);
        overflow: hidden;
        border: 3px solid transparent;
        transition: all 200ms ease-in;
      }

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .move-controls {
        position: absolute;
        top: 1rem;
        left: 1rem;
        display: flex;
      }

      .move-controls emblem-icon-button:not(:first-child) {
        margin-left: 1rem;
      }

      .scale-controls {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        display: flex;
      }

      .scale-controls emblem-icon-button:not(:first-child) {
        margin-left: 1rem;
      }

      .download {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateWidthAndHeight();
    window.addEventListener('resize', () => this.updateWidthAndHeight());
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        this.shadowRoot?.activeElement !==
        this.shadowRoot?.getElementById('container')
      ) {
        return;
      }
      event.preventDefault();
      this.handleKeyboard(event);
    });
  }

  render(): TemplateResult {
    return html`
      <div class="container" id="container" tabindex="0">
        ${this.renderCanvasElement(
          'back-canvas',
          this.backPosition,
          this.backScale
        )}
        ${this.renderCanvasElement(
          'front-canvas',
          this.frontPosition,
          this.frontScale
        )}
        ${this.renderCanvasElement(
          'word1-canvas',
          this.word1Position,
          this.word1Scale
        )}
        ${this.renderCanvasElement(
          'word2-canvas',
          this.word2Position,
          this.word2Scale
        )}
      </div>
      <div class="move-controls">
        <emblem-icon-button
          @click=${() => this.handleMoving(MoveDirection.LEFT)}
        >
          <img src="/assets/left.svg" />
        </emblem-icon-button>
        <emblem-icon-button @click=${() => this.handleMoving(MoveDirection.UP)}
          ><img src="/assets/up.svg"
        /></emblem-icon-button>
        <emblem-icon-button
          @click=${() => this.handleMoving(MoveDirection.DOWN)}
          ><img src="/assets/down.svg"
        /></emblem-icon-button>
        <emblem-icon-button
          @click=${() => this.handleMoving(MoveDirection.RIGHT)}
          ><img src="/assets/right.svg"
        /></emblem-icon-button>
      </div>
      <div class="scale-controls">
        <emblem-icon-button @click=${() => this.handleScaling(ScaleMode.UP)}
          ><img src="/assets/zoom-in.svg"
        /></emblem-icon-button>
        <emblem-icon-button @click=${() => this.handleScaling(ScaleMode.DOWN)}
          ><img src="/assets/zoom-out.svg"
        /></emblem-icon-button>
      </div>
      <emblem-icon-button
        class="download"
        @click=${() =>
          download({
            backChoice: this.backChoice,
            backPrimaryColor: this.backPrimaryColor,
            backSecondaryColor: this.backSecondaryColor,
            backPosition: this.backPosition,
            backScale: this.backScale,
            frontChoice: this.frontChoice,
            frontPrimaryColor: this.frontPrimaryColor,
            frontSecondaryColor: this.frontSecondaryColor,
            frontPosition: this.frontPosition,
            frontScale: this.frontScale,
            word1Choice: this.word1Choice,
            word1PrimaryColor: this.word1PrimaryColor,
            word1SecondaryColor: this.word1SecondaryColor,
            word1Position: this.word1Position,
            word1Scale: this.word1Scale,
            word2Choice: this.word2Choice,
            word2PrimaryColor: this.word2PrimaryColor,
            word2SecondaryColor: this.word2SecondaryColor,
            word2Position: this.word2Position,
            word2Scale: this.word2Scale,
          })}
      >
        <img src="/assets/download.svg" />
      </emblem-icon-button>
    `;
  }

  private renderCanvasElement(
    id: string,
    position = { x: 0, y: 0 },
    scale = 1
  ) {
    const canvasSize = Math.min(this.width || 0, this.height || 0);
    const absoluteX = (position.x / 100) * canvasSize;
    const absoluteY = (position.y / 100) * canvasSize;
    return html`
      <canvas
        id=${id}
        width=${this.width}
        height=${this.height}
        style=${styleMap({
          transform: `scale(${scale}) translate(${absoluteX}px, ${absoluteY}px)`,
        })}
      >
      </canvas>
    `;
  }

  async updated(changedProperties: Map<string, object>) {
    if (this.backHasChanged(changedProperties)) {
      this.drawImage(
        'back-canvas',
        this.backChoice,
        this.backPrimaryColor,
        this.backSecondaryColor
      );
    }
    if (this.frontHasChanged(changedProperties)) {
      this.drawImage(
        'front-canvas',
        this.frontChoice,
        this.frontPrimaryColor,
        this.frontSecondaryColor
      );
    }
    if (this.word1HasChanged(changedProperties)) {
      this.drawImage(
        'word1-canvas',
        this.word1Choice,
        this.word1PrimaryColor,
        this.word1SecondaryColor
      );
    }
    if (this.word2HasChanged(changedProperties)) {
      this.drawImage(
        'word2-canvas',
        this.word2Choice,
        this.word2PrimaryColor,
        this.word2SecondaryColor
      );
    }
  }

  private backHasChanged(changedProperties: Map<string, object>) {
    return (
      changedProperties.has('backChoice') ||
      changedProperties.has('backPrimaryColor') ||
      changedProperties.has('backSecondaryColor') ||
      changedProperties.has('width') ||
      changedProperties.has('height')
    );
  }

  private frontHasChanged(changedProperties: Map<string, object>) {
    return (
      changedProperties.has('frontChoice') ||
      changedProperties.has('frontPrimaryColor') ||
      changedProperties.has('frontSecondaryColor') ||
      changedProperties.has('width') ||
      changedProperties.has('height')
    );
  }

  private word1HasChanged(changedProperties: Map<string, object>) {
    return (
      changedProperties.has('word1Choice') ||
      changedProperties.has('word1PrimaryColor') ||
      changedProperties.has('word1SecondaryColor') ||
      changedProperties.has('width') ||
      changedProperties.has('height')
    );
  }

  private word2HasChanged(changedProperties: Map<string, object>) {
    return (
      changedProperties.has('word2Choice') ||
      changedProperties.has('word2PrimaryColor') ||
      changedProperties.has('word2SecondaryColor') ||
      changedProperties.has('width') ||
      changedProperties.has('height')
    );
  }

  private async drawImage(
    canvasId: string,
    part?: Part,
    primaryColor?: string,
    secondaryColor?: string
  ): Promise<void> {
    if (!this.width || !this.height) {
      return;
    }

    const element = this.shadowRoot?.getElementById(canvasId);
    return drawPart(element, part, primaryColor, secondaryColor);
  }

  private updateWidthAndHeight() {
    const { width, height } = this.getBoundingClientRect();
    this.width = Math.floor(width);
    this.height = Math.floor(height);
  }

  private handleKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey) {
      this.handleScalingViaKeyboard(event);
    } else {
      this.handleMovingViaKeyboard(event);
    }
  }

  private handleMovingViaKeyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.handleMoving(MoveDirection.LEFT);
        break;
      case 'ArrowRight':
        this.handleMoving(MoveDirection.RIGHT);
        break;
      case 'ArrowUp':
        this.handleMoving(MoveDirection.UP);
        break;
      case 'ArrowDown':
        this.handleMoving(MoveDirection.DOWN);
        break;
    }
  }

  private handleMoving(direction: MoveDirection) {
    const diff = { x: 0, y: 0 };
    switch (direction) {
      case MoveDirection.LEFT:
        diff.x = -STANDARD_POSITION_DIFF;
        break;
      case MoveDirection.RIGHT:
        diff.x = STANDARD_POSITION_DIFF;
        break;
      case MoveDirection.UP:
        diff.y = -STANDARD_POSITION_DIFF;
        break;
      case MoveDirection.DOWN:
        diff.y = STANDARD_POSITION_DIFF;
        break;
    }

    switch (this.tab) {
      case Tab.BACK:
        this.dispatchEvent(
          new CustomEvent('move-back', {
            detail: this.applyDiff(this.backPosition || DEFAULT_POSITION, diff),
          })
        );
        break;
      case Tab.FRONT:
        this.dispatchEvent(
          new CustomEvent('move-front', {
            detail: this.applyDiff(
              this.frontPosition || DEFAULT_POSITION,
              diff
            ),
          })
        );
        break;
      case Tab.WORD_1:
        this.dispatchEvent(
          new CustomEvent('move-word1', {
            detail: this.applyDiff(
              this.word1Position || DEFAULT_POSITION,
              diff
            ),
          })
        );
        break;
      case Tab.WORD_2:
        this.dispatchEvent(
          new CustomEvent('move-word2', {
            detail: this.applyDiff(
              this.word2Position || DEFAULT_POSITION,
              diff
            ),
          })
        );
        break;
    }
  }

  private applyDiff(position: PartPosition, diff: PartPosition) {
    return { x: position.x + diff.x, y: position.y + diff.y };
  }

  private handleScalingViaKeyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.handleScaling(ScaleMode.UP);
        break;
      case 'ArrowDown':
        this.handleScaling(ScaleMode.DOWN);
        break;
    }
  }

  private handleScaling(scaleMode: ScaleMode) {
    let diff = 0;
    switch (scaleMode) {
      case ScaleMode.UP:
        diff += STANDARD_SCALE_DIFF;
        break;
      case ScaleMode.DOWN:
        diff -= STANDARD_SCALE_DIFF;
        break;
    }

    switch (this.tab) {
      case Tab.BACK:
        this.dispatchEvent(
          new CustomEvent('scale-back', {
            detail: { scale: (this.backScale || 1) + diff },
          })
        );
        break;
      case Tab.FRONT:
        this.dispatchEvent(
          new CustomEvent('scale-front', {
            detail: { scale: (this.frontScale || 1) + diff },
          })
        );
        break;
      case Tab.WORD_1:
        this.dispatchEvent(
          new CustomEvent('scale-word1', {
            detail: { scale: (this.word1Scale || 1) + diff },
          })
        );
        break;
      case Tab.WORD_2:
        this.dispatchEvent(
          new CustomEvent('scale-word2', {
            detail: { scale: (this.word2Scale || 1) + diff },
          })
        );
        break;
    }
  }
}
