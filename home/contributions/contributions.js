import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class ContributionsComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles,
            css`
              div {
                padding-bottom: var(--size-1);
              }
            `
        ]
    }

    render() {
        return html`
            <section>
                <h2>OSS Contributions</h2>
                <div class="shadow rounded">
                    <slot></slot>
                </div>
            </section>
        `;
    }
}

customElements.define('ndp-contributions', ContributionsComponent);