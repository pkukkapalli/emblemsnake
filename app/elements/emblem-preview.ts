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
import { Part } from '../common/parts';
import { Tab } from './emblem-tabs';
import { styleMap } from 'lit-html/directives/style-map';
import {
  download,
  DownloadOrientation,
  getDownloadUrl,
} from '../services/download-service';
import { classMap } from 'lit-html/directives/class-map';
import debounce from 'lodash-es/debounce';
import { buttonStyles } from './emblem-styles';
import { PartPosition } from '../common/editor';

const STANDARD_POSITION_DIFF = 2;
const DEFAULT_POSITION = { x: 0, y: 0 };
const STANDARD_SCALE_DIFF = 0.1;
const ROTATE_DIFF = 3;

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

enum RotateDirection {
  COUNTERCLOCKWISE,
  CLOCKWISE,
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
  backRotation?: number;

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
  frontRotation?: number;

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
  word1Rotation?: number;

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
  @property()
  word2Rotation?: number;

  @internalProperty()
  width = 0;
  @internalProperty()
  height = 0;
  @internalProperty()
  isDownloading = false;
  @internalProperty()
  isDownloadOptionsOpen = false;

  static get styles(): CSSResult[] {
    return [
      buttonStyles,
      css`
        :host {
          position: relative;
        }

        .container {
          position: relative;
          background: black;
          box-sizing: border-box;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
          overflow: hidden;
          border: 3px solid transparent;
          transition: all 200ms ease-in;
          z-index: 1;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image {
          display: block;
          background-position: center;
          background-size: cover;
        }

        .move-controls {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          z-index: 2;
        }

        .undo-redo {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          z-index: 2;
        }

        .scale-controls {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          display: flex;
          z-index: 2;
        }

        .download {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          z-index: 2;
        }

        .download-options {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          width: 50%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease-in;
          z-index: 2;
        }

        .download-options.open {
          opacity: 1;
          pointer-events: auto;
        }

        .download-options button.icon {
          margin-bottom: 1rem;
          float: right;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateWidthAndHeight();
    window.addEventListener(
      'resize',
      debounce(() => this.updateWidthAndHeight(), 100)
    );
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
      <div class="move-controls">
        <button
          class="icon"
          @click=${() => this.handleMoving(MoveDirection.LEFT)}
        >
          <img src="/assets/left.svg" />
        </button>
        <button
          class="icon"
          @click=${() => this.handleMoving(MoveDirection.UP)}
        >
          <img src="/assets/up.svg" />
        </button>
        <button
          class="icon"
          @click=${() => this.handleMoving(MoveDirection.DOWN)}
        >
          <img src="/assets/down.svg" />
        </button>
        <button
          class="icon"
          @click=${() => this.handleMoving(MoveDirection.RIGHT)}
        >
          <img src="/assets/right.svg" />
        </button>
      </div>
      <div class="undo-redo">
        <button class="icon" @click=${() => this.handleUndo()}>
          <img src="/assets/undo.svg" />
        </button>
        <button class="icon" @click=${() => this.handleRedo()}>
          <img src="/assets/redo.svg" />
        </button>
      </div>
      <div class="scale-controls">
        <button class="icon" @click=${() => this.handleScaling(ScaleMode.UP)}>
          <img src="/assets/zoom-in.svg" />
        </button>
        <button class="icon" @click=${() => this.handleScaling(ScaleMode.DOWN)}>
          <img src="/assets/zoom-out.svg" />
        </button>
        <button
          class="icon"
          @click=${() => this.handleRotating(RotateDirection.COUNTERCLOCKWISE)}
        >
          <img src="/assets/rotate-left.svg" />
        </button>
        <button
          class="icon"
          @click=${() => this.handleRotating(RotateDirection.CLOCKWISE)}
        >
          <img src="/assets/rotate-right.svg" />
        </button>
      </div>
      <button
        class="download icon"
        @click=${() => (this.isDownloadOptionsOpen = true)}
      >
        <img src="/assets/download.svg" />
      </button>
      <div
        class=${classMap({
          'download-options': true,
          open: this.isDownloadOptionsOpen,
        })}
      >
        <button
          class="icon"
          @click=${() => (this.isDownloadOptionsOpen = false)}
        >
          <img src="/assets/close.svg" />
        </button>
        <button
          @click=${() => this.download(DownloadOrientation.DESKTOP_LEFT_ALIGN)}
        >
          Desktop Wallpaper Left-aligned
        </button>
        <button
          @click=${() =>
            this.download(DownloadOrientation.DESKTOP_CENTER_ALIGN)}
        >
          Desktop Wallpaper Center-aligned
        </button>
        <button
          @click=${() => this.download(DownloadOrientation.DESKTOP_RIGHT_ALIGN)}
        >
          Desktop Wallpaper Right-aligned
        </button>
        <button @click=${() => this.download(DownloadOrientation.PHONE)}>
          Phone Wallpaper
        </button>
      </div>
      <div class="container" id="container" tabindex="0">
        ${this.renderCanvasElement(Tab.BACK)}
        ${this.renderCanvasElement(Tab.FRONT)}
        ${this.renderCanvasElement(Tab.WORD_1)}
        ${this.renderCanvasElement(Tab.WORD_2)}
      </div>
    `;
  }

  private renderCanvasElement(tab: Tab) {
    let editorConfig, position, scale, rotation;
    switch (tab) {
      case Tab.BACK:
        editorConfig = {
          backChoice: this.backChoice,
          backPrimaryColor: this.backPrimaryColor,
          backSecondaryColor: this.backSecondaryColor,
        };
        position = this.backPosition;
        scale = this.backScale;
        rotation = this.backRotation;
        break;
      case Tab.FRONT:
        editorConfig = {
          frontChoice: this.frontChoice,
          frontPrimaryColor: this.frontPrimaryColor,
          frontSecondaryColor: this.frontSecondaryColor,
        };
        position = this.frontPosition;
        scale = this.frontScale;
        rotation = this.frontRotation;
        break;
      case Tab.WORD_1:
        editorConfig = {
          word1Choice: this.word1Choice,
          word1PrimaryColor: this.word1PrimaryColor,
          word1SecondaryColor: this.word1SecondaryColor,
        };
        position = this.word1Position;
        scale = this.word1Scale;
        rotation = this.word1Rotation;
        break;
      case Tab.WORD_2:
        editorConfig = {
          word2Choice: this.word2Choice,
          word2PrimaryColor: this.word2PrimaryColor,
          word2SecondaryColor: this.word2SecondaryColor,
        };
        position = this.word2Position;
        scale = this.word2Scale;
        rotation = this.word2Rotation;
        break;
    }

    position = position || DEFAULT_POSITION;
    scale = scale || 1;
    rotation = rotation || 0;

    const url = getDownloadUrl(DownloadOrientation.SQUARE, editorConfig);
    const canvasSize = Math.min(this.width || 0, this.height || 0);
    const absoluteX = Math.floor((position.x / 100) * canvasSize);
    const absoluteY = Math.floor((position.y / 100) * canvasSize);
    return html`
      <div class="image-container">
      <img
        class="image"
        width=${canvasSize}
        height=${canvasSize}
        src=${url}
        style=${styleMap({
          transform: `scale(${scale}) translate(${absoluteX}px, ${absoluteY}px) rotate(${rotation}deg)`,
        })}
      ></img>
      </div>
    `;
  }

  private updateWidthAndHeight() {
    const { width, height } = this.getBoundingClientRect();
    this.width = Math.floor(width);
    this.height = Math.floor(height);
  }

  private handleUndo() {
    this.dispatchEvent(new CustomEvent('undo'));
  }

  private handleRedo() {
    this.dispatchEvent(new CustomEvent('redo'));
  }

  private handleKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey) {
      this.handleScalingAndRotatingViaKeyboard(event);
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

  private handleScalingAndRotatingViaKeyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.handleScaling(ScaleMode.UP);
        break;
      case 'ArrowDown':
        this.handleScaling(ScaleMode.DOWN);
        break;
      case 'ArrowLeft':
        this.handleRotating(RotateDirection.COUNTERCLOCKWISE);
        break;
      case 'ArrowRight':
        this.handleRotating(RotateDirection.CLOCKWISE);
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

  private handleRotating(direction: RotateDirection) {
    let degreesDiff = 0;
    switch (direction) {
      case RotateDirection.COUNTERCLOCKWISE:
        degreesDiff = -ROTATE_DIFF;
        break;
      case RotateDirection.CLOCKWISE:
        degreesDiff = ROTATE_DIFF;
        break;
    }

    switch (this.tab) {
      case Tab.BACK:
        this.dispatchEvent(
          new CustomEvent('rotate-back', {
            detail: { rotation: (this.backRotation || 0) + degreesDiff },
          })
        );
        break;
      case Tab.FRONT:
        this.dispatchEvent(
          new CustomEvent('rotate-front', {
            detail: { rotation: (this.frontRotation || 0) + degreesDiff },
          })
        );
        break;
      case Tab.WORD_1:
        this.dispatchEvent(
          new CustomEvent('rotate-word1', {
            detail: { rotation: (this.word1Rotation || 0) + degreesDiff },
          })
        );
        break;
      case Tab.WORD_2:
        this.dispatchEvent(
          new CustomEvent('rotate-word2', {
            detail: { rotation: (this.word2Rotation || 0) + degreesDiff },
          })
        );
        break;
    }
  }

  private async download(orientation: DownloadOrientation) {
    if (this.isDownloading) {
      return;
    }
    this.isDownloading = true;
    await download(orientation, {
      backChoice: this.backChoice,
      backPrimaryColor: this.backPrimaryColor,
      backSecondaryColor: this.backSecondaryColor,
      backPosition: this.backPosition,
      backScale: this.backScale,
      backRotation: this.backRotation,
      frontChoice: this.frontChoice,
      frontPrimaryColor: this.frontPrimaryColor,
      frontSecondaryColor: this.frontSecondaryColor,
      frontPosition: this.frontPosition,
      frontScale: this.frontScale,
      frontRotation: this.frontRotation,
      word1Choice: this.word1Choice,
      word1PrimaryColor: this.word1PrimaryColor,
      word1SecondaryColor: this.word1SecondaryColor,
      word1Position: this.word1Position,
      word1Scale: this.word1Scale,
      word1Rotation: this.word1Rotation,
      word2Choice: this.word2Choice,
      word2PrimaryColor: this.word2PrimaryColor,
      word2SecondaryColor: this.word2SecondaryColor,
      word2Position: this.word2Position,
      word2Scale: this.word2Scale,
      word2Rotation: this.word2Rotation,
    });
    this.isDownloading = false;
    this.isDownloadOptionsOpen = false;
  }
}
