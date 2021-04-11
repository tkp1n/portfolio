import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../styles.js';
import './logos/github.js';
import './logos/linkedin.js';
import './logos/twitter.js';

export class NavComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles,
            css`
              nav {
                display: flex;
                flex-grow: 1;
                padding-top: var(--size-2);
                justify-content: center;
              }

              @media (min-width: 640px) {
                nav {
                  justify-content: flex-end;
                }
              }

              ndp-github, ndp-linkedin, ndp-twitter {
                display: inline-block;
                margin-right: var(--size-1_5);
                height: var(--size-5);
                width: var(--size-5);
              }
            `
        ]
    }

    render() {
        return html`
            <nav>
                <a href="https://github.com/tkp1n" alt="GitHub"><ndp-github></ndp-github></a>
                <a href="https://www.linkedin.com/in/ndportmann/" alt="LinkedIn"><ndp-linkedin></ndp-linkedin></a>
                <a href="https://twitter.com/tkp1n" alt="Twitter"><ndp-twitter></ndp-twitter></a>
            </nav>
        `;
    }
}

customElements.define("ndp-nav", NavComponent);