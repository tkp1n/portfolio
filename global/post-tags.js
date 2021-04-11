import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../styles.js';
import './icons/calendar-icon.js';
import './icons/tag-icon.js';
import './icons/user-icon.js';

export class PostTagsComponent extends LitElement {
    static get properties() {
        return {
            date: {type: String},
            author: {type: String},
            category: {type: String},
        };
    }

    static get styles() {
        return [
            ...globalStyles,
            css`
              .meta {
                font-size: var(--size-3_5);
                line-height: var(--size-5);
                font-weight: var(--weight-light);
                margin-right: var(--size-3);
              }
            `
        ]
    }

    render() {
        return html`
            <section>
                <ndp-calendar-icon></ndp-calendar-icon>
                <span class="meta">${this.date}</span>
                <ndp-user-icon></ndp-user-icon>
                <span class="meta">${this.author}</span>
                <ndp-tag-icon></ndp-tag-icon>
                <span class="meta">${this.category}</span>
            </section>
        `;
    }
}

customElements.define("ndp-post-tags", PostTagsComponent);