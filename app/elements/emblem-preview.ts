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

function parseColor(color: string) {
  return {
    r: Number.parseInt(color.substring(1, 3), 16),
    g: Number.parseInt(color.substring(3, 5), 16),
    b: Number.parseInt(color.substring(5, 7), 16),
  };
}

@customElement('emblem-preview')
export class EmblemPreview extends LitElement {
  @property()
  backChoice?: Part;

  @property()
  backPrimaryColor?: string;

  @property()
  backSecondaryColor?: string;

  @property()
  frontChoice?: Part;

  @property()
  frontPrimaryColor?: string;

  @property()
  frontSecondaryColor?: string;

  @property()
  word1Choice?: Part;

  @property()
  word1PrimaryColor?: string;

  @property()
  word1SecondaryColor?: string;

  @property()
  word2Choice?: Part;

  @property()
  word2PrimaryColor?: string;

  @property()
  word2SecondaryColor?: string;

  @internalProperty()
  width?: number;

  @internalProperty()
  height?: number;

  static get styles(): CSSResult {
    return css`
      .container {
        position: relative;
        background: black;
        height: 100%;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateWidthAndHeight();
    window.addEventListener('resize', () => this.updateWidthAndHeight());
  }

  render(): TemplateResult {
    return html`
      <div class="container">
        <canvas id="back-canvas" width=${this.width} height=${this.height}>
        </canvas>
        <canvas id="front-canvas" width=${this.width} height=${this.height}>
        </canvas>
        <canvas id="word1-canvas" width=${this.width} height=${this.height}>
        </canvas>
        <canvas id="word2-canvas" width=${this.width} height=${this.height}>
        </canvas>
      </div>
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
    if (!this.width || !this.height || !part) {
      return;
    }

    const canvas = this.shadowRoot?.getElementById(canvasId);
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const image = document.createElement('img');
    image.src = part.path;

    return new Promise(resolve => {
      context.clearRect(
        0,
        0,
        Math.floor(canvas.width),
        Math.floor(canvas.height)
      );
      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(
          image,
          Math.floor(x),
          Math.floor(y),
          Math.floor(imageSize),
          Math.floor(imageSize)
        );
        const imageData = context.getImageData(
          0,
          0,
          Math.floor(canvas.width),
          Math.floor(canvas.height)
        );
        for (let row = 0; row < canvas.height; row++) {
          for (let col = 0; col < canvas.width; col++) {
            const index = row * Math.floor(canvas.width) * 4 + col * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            if (r < 128 && g < 128 && b < 128) {
              const color = parseColor(primaryColor || '#000000');
              imageData.data[index] = color.r;
              imageData.data[index + 1] = color.g;
              imageData.data[index + 2] = color.b;
            } else if (r >= 128 && g >= 128 && b >= 128) {
              const color = parseColor(secondaryColor || '#ffffff');
              imageData.data[index] = color.r;
              imageData.data[index + 1] = color.g;
              imageData.data[index + 2] = color.b;
            }
          }
        }
        context.putImageData(imageData, 0, 0);
        resolve();
      };
    });
  }

  private updateWidthAndHeight() {
    const { width, height } = this.getBoundingClientRect();
    this.width = Math.floor(width);
    this.height = Math.floor(height);
  }
}
