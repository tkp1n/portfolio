import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../styles.js';

export class HomeHeaderComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles,
            css`
              h1 {
                font-size: var(--size-6);
                line-height: var(--size-8);
              }

              @media (min-width: 1024px) {
                h1 {
                  font-size: var(--size-7_5);
                  line-height: var(--size-9);
                }
              }

              .sub {
                font-size: var(--size-4_5);
                line-height: var(--size-7);
                font-weight: var(--weight-extralight);
              }

              @media (min-width: 1024px) {
                .sub {
                  font-size: var(--size-5);
                  line-height: var(--size-7);
                }
              }

              .outer {
                margin-top: var(--size-10);
                background-color: var(--blue-600);
                transform: skewY(6deg);
                width: 66.666667%;
                max-width: var(--size-xs);
                min-width: -webkit-min-content;
                min-width: min-content;
              }

              @media (min-width: 1024px) {
                .outer {
                  max-width: var(--size-md);
                }
              }

              .inner {
                padding: var(--size-2);
                background-color: var(--white);
                transform: skewY(-6deg);
                width: 80%;
              }
            `
        ];
    }

    render() {
        return html`
            <div class="outer shadow rounded mx-auto">
                <div class="inner shadow rounded mx-auto">
                    <header>
                        <h1>Nicolas Portmann</h1>
                        <p class="sub">Software Engineer</p>
                    </header>
                </div>
            </div>
        `;
    }
}

customElements.define("ndp-home-header", HomeHeaderComponent);