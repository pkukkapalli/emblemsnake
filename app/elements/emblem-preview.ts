import { LitElement, customElement, property, CSSResult, css, TemplateResult, html, internalProperty } from 'lit-element';
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
      canvas {
        background: black;
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
      <canvas
        id="canvas"
        width=${this.width}
        height=${this.height}>
      </canvas>
    `;
  }

  async updated() {
    const canvas = this.shadowRoot?.getElementById('canvas');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const backCanvas = await this.drawImage(this.backChoice, this.backPrimaryColor, this.backSecondaryColor);
    if (backCanvas) {
      context.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
    }

    const frontCanvas = await this.drawImage(this.frontChoice, this.frontPrimaryColor, this.frontSecondaryColor);
    if (frontCanvas) {
      context.drawImage(frontCanvas, 0, 0, canvas.width, canvas.height);
    }

    const word1Canvas = await this.drawImage(this.word1Choice, this.word1PrimaryColor, this.word1SecondaryColor);
    if (word1Canvas) {
      context.drawImage(word1Canvas, 0, 0, canvas.width, canvas.height);
    }

    const word2Canvas = await this.drawImage(this.word2Choice, this.word2PrimaryColor, this.word2SecondaryColor);
    if (word2Canvas) {
      context.drawImage(word2Canvas, 0, 0, canvas.width, canvas.height);
    }
  }

  private drawImage(part: Part | undefined, primaryColor: string | undefined, secondaryColor: string | undefined): Promise<HTMLCanvasElement | undefined> {
    return new Promise(resolve => {
      if (!this.width || !this.height) {
        resolve();
        return;
      }
      
      const scale = 1;
      const canvas = document.createElement('canvas');    
      canvas.width = Math.floor(this.width) * scale;
      canvas.height = Math.floor(this.height) * scale;
      const context = canvas.getContext('2d');
      if (!context || !part) {
        resolve();
        return;
      }
      context.imageSmoothingQuality = 'high';

      const image = document.createElement('img');
      image.src = part.path;

      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(image, Math.floor(x), Math.floor(y), Math.floor(imageSize), Math.floor(imageSize));
        const imageData = context.getImageData(0, 0, Math.floor(canvas.width), Math.floor(canvas.height));
        for (let row = 0; row < canvas.height; row++) {
          for (let col = 0; col < canvas.width; col++) {
            const index = (row * Math.floor(canvas.width) * 4) + (col * 4);
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
        resolve(canvas);
      };
    });
  }

  private updateWidthAndHeight() {
    const { width, height } = this.getBoundingClientRect();
    this.width = width;
    this.height = height;
  }
}
