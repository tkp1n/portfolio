import { LitElement, html } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class UserIconComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles
        ]
    }

    render() {
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        `;
    }
}

customElements.define("ndp-user-icon", UserIconComponent);