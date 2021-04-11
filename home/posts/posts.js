import { LitElement, html } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class PostListComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles
        ];
    }

    render() {
        return  html`
            <section>
                <h2>Blog Posts</h2>
                <div>
                    <slot></slot>
                </div>
            </section>
        `;
    }
}

customElements.define("ndp-post-list", PostListComponent);