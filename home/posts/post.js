import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../../styles.js';
import '../../global/post-tags.js';

export class PostListItemComponent extends LitElement {
    static get properties() {
        return {
            url: { type: String },
            imgUrl: { type: String },
            avif: { type: String },
            webp: { type: String },
            jpeg: { type: String },
            title: { type: String },
            date: { type: String },
            author: { type: String },
            category: { type: String },
            abstract: { type: String },
        };
    }

    static get styles() {
        return [
            ...globalStyles,
            css`
              article {
                margin-top: var(--size-2);
                border-width: 1px;
              }

              img {
                border-top-left-radius: var(--size-1);
                border-top-right-radius: var(--size-1);
                height: auto;
                width: 100%;
              }

              .content {
                padding: var(--size-2);
              }

              .subtext {
                letter-spacing: -0.025em;
                color: var(--gray-800);
              }

              h3 {
                margin-top: 0;
              }
            `
        ];
    }

    render() {
        return html`
        <article class="border shadow rounded">
            <a href="${this.url}">
                <picture>
                    <source type="image/avif" srcset="${this.avif}"/>
                    <source type="image/webp" srcset="${this.webp}"/>
                    <img src="${this.jpeg}" alt="${this.title}" loading="lazy" decoding="async"/>
                </picture>
                <div class="content">
                    <h3 class="tracking-tight">${this.title}</h3>
                    <p>
                        <ndp-post-tags
                            date="${this.date}"
                            author="${this.author}"
                            category="${this.category}"
                        ></ndp-post-tags>
                    </p>
                    <p class="subtext">${this.abstract}</p>
                </div>
            </a>
        </article>
        `;
    }
}

customElements.define('ndp-post-list-item', PostListItemComponent);