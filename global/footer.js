import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../styles.js';

export class FooterComponent extends LitElement {
    static get properties() {
        return {
            year: {type: Number}
        }
    }

    static get styles() {
        return [
            ...globalStyles,
            css`
              footer {
                margin-top: var(--size-5);
                margin-bottom: var(--size-2);
                display: flex;
                justify-content: center;
              }
            `
        ];
    }

    constructor() {
        super();
        this.year = new Date().getFullYear();
    }

    render() {
        return html`
            <footer>
                <p class="text-xs">&#169; ${this.year} - Nicolas Portmann</p>
            </footer>
        `;
    }
}

customElements.define("ndp-footer", FooterComponent);