import { html, fixture, expect } from '@open-wc/testing';

import { EmblemApp } from '../src/elements/emblem-app';

describe('EmblemApp', () => {
  let element: EmblemApp;
  beforeEach(async () => {
    element = await fixture(html` <emblem-app></emblem-app> `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
