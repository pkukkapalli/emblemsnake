import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { until } from 'lit-html/directives/until';
import { styleMap } from 'lit-html/directives/style-map';
import { Part } from '../constants/parts';

// TODO: remove polymer elements
import '@polymer/paper-spinner/paper-spinner-lite';

function getColorAsRgb(color: string): { r: number; g: number; b: number } {
  const r = color.substring(1, 3);
  const g = color.substring(3, 5);
  const b = color.substring(5, 7);
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}

function getCanvasForImagePart(
  part: Part,
  primaryColor?: string,
  secondaryColor?: string
): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    const image = document.createElement('img');
    const {
      r: primaryColorRed,
      g: primaryColorGreen,
      b: primaryColorBlue,
    } = getColorAsRgb(primaryColor || '#000000');
    const {
      r: secondaryColorRed,
      g: secondaryColorGreen,
      b: secondaryColorBlue,
    } = getColorAsRgb(secondaryColor || '#ffffff');
    image.onload = (): void => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('could not create 2D canvas context');
      }
      context.drawImage(image, 0, 0, image.width, image.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i] > 127 &&
          data[i + 1] > 127 &&
          data[i + 2] > 127 &&
          data[i + 3] > 0
        ) {
          data[i] = secondaryColorRed;
          data[i + 1] = secondaryColorGreen;
          data[i + 2] = secondaryColorBlue;
          data[i + 3] = 255;
        } else if (
          data[i] <= 127 &&
          data[i + 1] <= 127 &&
          data[i + 2] <= 127 &&
          data[i + 3] > 0
        ) {
          data[i] = primaryColorRed;
          data[i + 1] = primaryColorGreen;
          data[i + 2] = primaryColorBlue;
          data[i + 3] = 255;
        }
      }
      context.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
    if (!part.path) {
      throw new Error(`invalid image part with no path ${part.path}`);
    }
    image.src = part.path;
  });
}

function getCanvasForWordPart(
  part: Part,
  primaryColor?: string,
  secondaryColor?: string
): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('could not create 2D canvas context');
    }
    context.font = '60px Wallpoet';
    context.strokeStyle = secondaryColor || 'white';
    context.lineWidth = 6;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const x = Math.floor(context.canvas.width / 2);
    const y = Math.floor(context.canvas.height / 2);
    context.strokeText(part.name, x, y);
    context.fillStyle = primaryColor || 'black';
    context.fillText(part.name, x, y);
    resolve(canvas);
  });
}

@customElement('emblem-preview')
export class EmblemPreview extends LitElement {
  @property({ type: Object })
  private backChoice?: Part;

  @property({ type: String })
  private backPrimaryColor?: string;

  @property({ type: String })
  private backSecondaryColor?: string;

  @property({ type: Object })
  private frontChoice?: Part;

  @property({ type: String })
  private frontPrimaryColor?: string;

  @property({ type: String })
  private frontSecondaryColor?: string;

  @property({ type: Object })
  private word1Choice?: Part;

  @property({ type: String })
  private word1PrimaryColor?: string;

  @property({ type: String })
  private word1SecondaryColor?: string;

  @property({ type: Object })
  private word2Choice?: Part;

  @property({ type: String })
  private word2PrimaryColor?: string;

  @property({ type: String })
  private word2SecondaryColor?: string;

  static get styles(): CSSResult {
    return css`
      :root {
        --paper-spinner-color: var(--google-grey-900);
        --paper-spinner-stroke-width: 8px;
      }

      .preview {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      .default {
        background: #252124;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      ${until(
        this.renderImage(),
        html` <paper-spinner-lite></paper-spinner-lite> `
      )}
    `;
  }

  private async renderImage(): Promise<TemplateResult> {
    const url = await this.getDataUrlForCanvas();
    if (!url) {
      return html` <div class="preview default"></div> `;
    }

    const styles = styleMap({ backgroundImage: `url(${url})` });
    return html` <div class="preview" style=${styles}></div> `;
  }

  private async getDataUrlForCanvas(): Promise<string | null> {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');

    if (
      !this.backChoice &&
      !this.frontChoice &&
      !this.word1Choice &&
      !this.word2Choice
    ) {
      return null;
    }

    if (!context) {
      throw new Error('could not create 2D canvas context');
    }

    if (this.backChoice) {
      const subCanvas = await getCanvasForImagePart(
        this.backChoice,
        this.backPrimaryColor,
        this.backSecondaryColor
      );
      context.drawImage(subCanvas, 0, 0, canvas.width, canvas.height);
    }

    if (this.frontChoice) {
      const subCanvas = await getCanvasForImagePart(
        this.frontChoice,
        this.frontPrimaryColor,
        this.frontSecondaryColor
      );
      context.drawImage(subCanvas, 0, 0, canvas.width, canvas.height);
    }

    if (this.word1Choice) {
      const subCanvas = await getCanvasForWordPart(
        this.word1Choice,
        this.word1PrimaryColor,
        this.word1SecondaryColor
      );
      context.drawImage(subCanvas, 0, 0, canvas.width, canvas.height);
    }

    if (this.word2Choice) {
      const subCanvas = await getCanvasForWordPart(
        this.word2Choice,
        this.word2PrimaryColor,
        this.word2SecondaryColor
      );
      context.drawImage(subCanvas, 0, 0, canvas.width, canvas.height);
    }

    return canvas.toDataURL();
  }
}
