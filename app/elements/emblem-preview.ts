import { LitElement, customElement, property, CSSResult, css, TemplateResult, html, internalProperty } from 'lit-element';
import { Part } from '../constants/parts';

@customElement('emblem-preview')
export class EmblemPreview extends LitElement {
  @property()
  backChoice?: Part;

  @property()
  frontChoice?: Part;

  @property()
  word1Choice?: Part;

  @property()
  word2Choice?: Part; 

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

    const backCanvas = await this.drawBack();
    if (backCanvas) {
      context.drawImage(backCanvas, 0, 0);
    }

    const frontCanvas = await this.drawFront();
    if (frontCanvas) {
      context.drawImage(frontCanvas, 0, 0);
    }

    const word1Canvas = await this.drawWord1();
    if (word1Canvas) {
      context.drawImage(word1Canvas, 0, 0);
    }

    const word2Canvas = await this.drawWord2();
    if (word2Canvas) {
      context.drawImage(word2Canvas, 0, 0);
    }
  }

  private drawBack(): Promise<HTMLCanvasElement | undefined> {
    return new Promise(resolve => {
      if (!this.width || !this.height) {
        resolve();
        return;
      }
      
      const canvas = document.createElement('canvas');    
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
      if (!context || !this.backChoice) {
        resolve();
        return;
      }

      const image = document.createElement('img');
      image.src = this.backChoice.path;

      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(image, x, y, imageSize, imageSize);
        resolve(canvas);
      };
    });
  }

  private drawFront(): Promise<HTMLCanvasElement | undefined> {
    return new Promise(resolve => {
      if (!this.width || !this.height) {
        resolve();
        return;
      }
      
      const canvas = document.createElement('canvas');    
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
      if (!context || !this.frontChoice) {
        resolve();
        return;
      }

      const image = document.createElement('img');
      image.src = this.frontChoice.path;

      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(image, x, y, imageSize, imageSize);
        resolve(canvas);
      };
    });
  }

  private drawWord1(): Promise<HTMLCanvasElement | undefined> {
    return new Promise(resolve => {
      if (!this.width || !this.height) {
        resolve();
        return;
      }
      
      const canvas = document.createElement('canvas');    
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
      if (!context || !this.word1Choice) {
        resolve();
        return;
      }

      const image = document.createElement('img');
      image.src = this.word1Choice.path;
      
      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(image, x, y, imageSize, imageSize);
        resolve(canvas);
      };
    });
  }

  private drawWord2(): Promise<HTMLCanvasElement | undefined> {
    return new Promise(resolve => {
      if (!this.width || !this.height) {
        resolve();
        return;
      }
      
      const canvas = document.createElement('canvas');    
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
      if (!context || !this.word2Choice) {
        resolve();
        return;
      }

      const image = document.createElement('img');
      image.src = this.word2Choice.path;
      
      image.onload = () => {
        const imageSize = Math.min(canvas.width, canvas.height);
        const x = Math.max(0, (canvas.width - canvas.height) / 2);
        const y = Math.max(0, (canvas.height - canvas.width) / 2);
        context.drawImage(image, x, y, imageSize, imageSize);
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
