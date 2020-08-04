import {
  LitElement,
  html,
  property,
  customElement,
  TemplateResult,
} from 'lit-element';
import { PartType } from '../constants/parts';
import { ViewType } from '../constants/routes';
import { RouterStore } from '../stores/router-store';
import { PartsStore, PartsState } from '../stores/parts-store';
import { EditorStore, EditorState } from '../stores/editor-store';
import { ColorsStore, ColorsState } from '../stores/colors-store';

import './emblem-main-menu';
import './emblem-sub-menu';
import './emblem-image-menu';
import './emblem-word-menu';
import './emblem-adjust';
import './emblem-color-menu';

@customElement('emblem-app')
export class EmblemApp extends LitElement {
  private editorStore: EditorStore;

  private partsStore: PartsStore;

  private colorsStore: ColorsStore;

  private routerStore: RouterStore;

  @property({ type: Object })
  private editorState?: EditorState;

  @property({ type: Object })
  private partsState?: PartsState;

  @property({ type: Object })
  private colorsState?: ColorsState;

  @property({ type: String })
  private view: ViewType;

  constructor() {
    super();
    this.view = ViewType.MAIN_MENU;

    this.editorStore = new EditorStore(state => {
      this.editorState = state;
    });
    this.partsStore = new PartsStore(state => {
      this.partsState = state;
    });
    this.colorsStore = new ColorsStore(state => {
      this.colorsState = state;
    });
    this.routerStore = new RouterStore(view => {
      this.view = view;
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.editorStore.connect();
    this.partsStore.connect();
    this.colorsStore.connect();
    this.routerStore.connect();
  }

  render(): TemplateResult {
    switch (this.view) {
      case ViewType.MAIN_MENU:
        return html`
          <emblem-main-menu
            .backChoice=${this.editorState?.backChoice}
            .backPrimaryColor=${this.editorState?.backPrimaryColor}
            .backSecondaryColor=${this.editorState?.backSecondaryColor}
            .frontChoice=${this.editorState?.frontChoice}
            .frontPrimaryColor=${this.editorState?.frontPrimaryColor}
            .frontSecondaryColor=${this.editorState?.frontSecondaryColor}
            .word1Choice=${this.editorState?.word1Choice}
            .word1PrimaryColor=${this.editorState?.word1PrimaryColor}
            .word1SecondaryColor=${this.editorState?.word1SecondaryColor}
            .word2Choice=${this.editorState?.word2Choice}
            .word2PrimaryColor=${this.editorState?.word2PrimaryColor}
            .word2SecondaryColor=${this.editorState?.word2SecondaryColor}
          ></emblem-main-menu>
        `;

      case ViewType.BACK_MENU:
        return html`
          <emblem-sub-menu
            .partType=${PartType.BACK}
            .choice=${this.editorState?.backChoice}
            .primaryColor=${this.editorState?.backPrimaryColor}
            .secondaryColor=${this.editorState?.backSecondaryColor}
          ></emblem-sub-menu>
        `;
      case ViewType.CHOOSE_BACK_MENU:
        return html`
          <emblem-image-menu
            .partType=${PartType.BACK}
            .parts=${this.partsState?.backParts}
            .selected=${this.editorState?.backChoice}
            .primaryColor=${this.editorState?.backPrimaryColor}
            .secondaryColor=${this.editorState?.backSecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setBackChoice(event.detail.part);
            }}
          >
          </emblem-image-menu>
        `;
      case ViewType.ADJUST_BACK_MENU:
        return html` <emblem-adjust></emblem-adjust> `;
      case ViewType.PRIMARY_COLOR_BACK_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.backPrimaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setBackPrimaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;
      case ViewType.SECONDARY_COLOR_BACK_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.backSecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setBackSecondaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;

      case ViewType.FRONT_MENU:
        return html`
          <emblem-sub-menu
            .partType=${PartType.FRONT}
            .choice=${this.editorState?.frontChoice}
            .primaryColor=${this.editorState?.frontPrimaryColor}
            .secondaryColor=${this.editorState?.frontSecondaryColor}
          ></emblem-sub-menu>
        `;
      case ViewType.CHOOSE_FRONT_MENU:
        return html`
          <emblem-image-menu
            .partType=${PartType.FRONT}
            .parts=${this.partsState?.frontParts}
            .selected=${this.editorState?.frontChoice}
            .primaryColor=${this.editorState?.frontPrimaryColor}
            .secondaryColor=${this.editorState?.frontSecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setFrontChoice(event.detail.part);
            }}
          >
          </emblem-image-menu>
        `;
      case ViewType.ADJUST_FRONT_MENU:
        return html` <emblem-adjust></emblem-adjust> `;
      case ViewType.PRIMARY_COLOR_FRONT_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.frontPrimaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setFrontPrimaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;
      case ViewType.SECONDARY_COLOR_FRONT_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.frontSecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setFrontSecondaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;

      case ViewType.WORD1_MENU:
        return html`
          <emblem-sub-menu
            .partType=${PartType.WORD_1}
            .choice=${this.editorState?.word1Choice}
            .primaryColor=${this.editorState?.word1PrimaryColor}
            .secondaryColor=${this.editorState?.word1SecondaryColor}
          ></emblem-sub-menu>
        `;
      case ViewType.CHOOSE_WORD1_MENU:
        return html`
          <emblem-word-menu
            .parts=${this.partsState?.wordParts}
            .selected=${this.editorState?.word1Choice}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord1Choice(event.detail.part);
            }}
          >
          </emblem-word-menu>
        `;
      case ViewType.ADJUST_WORD1_MENU:
        return html` <emblem-adjust></emblem-adjust> `;
      case ViewType.PRIMARY_COLOR_WORD1_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.word1PrimaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord1PrimaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;
      case ViewType.SECONDARY_COLOR_WORD1_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.word1SecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord1SecondaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;

      case ViewType.WORD2_MENU:
        return html`
          <emblem-sub-menu
            .partType=${PartType.WORD_2}
            .choice=${this.editorState?.word2Choice}
            .primaryColor=${this.editorState?.word2PrimaryColor}
            .secondaryColor=${this.editorState?.word2SecondaryColor}
          ></emblem-sub-menu>
        `;
      case ViewType.CHOOSE_WORD2_MENU:
        return html`
          <emblem-word-menu
            .parts=${this.partsState?.wordParts}
            .selected=${this.editorState?.word2Choice}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord2Choice(event.detail.part);
            }}
          >
          </emblem-word-menu>
        `;
      case ViewType.ADJUST_WORD2_MENU:
        return html` <emblem-adjust></emblem-adjust> `;
      case ViewType.PRIMARY_COLOR_WORD2_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.word2PrimaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord2PrimaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;
      case ViewType.SECONDARY_COLOR_WORD2_MENU:
        return html`
          <emblem-color-menu
            .palette=${this.colorsState?.palette}
            .selected=${this.editorState?.word2SecondaryColor}
            @select=${(event: CustomEvent): void => {
              this.editorStore.setWord2SecondaryColor(event.detail.color);
            }}
          ></emblem-color-menu>
        `;
      default:
        // TODO: create a proper 404 component
        return html` 404 Not Found `;
    }
  }
}
