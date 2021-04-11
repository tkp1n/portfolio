import { html, css } from '../../lib/ndp.js';
import '../../global/post-tags.js';

const styles = css`
@import '/styles.css';
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
`;

const template = attr => html`
<article class="border shadow rounded">
    <a href="${attr.url}">
        <picture>
            <source type="image/avif" srcset="${attr.imgUrl.avif}"/>
            <source type="image/webp" srcset="${attr.imgUrl.webp}"/>
            <img src="${attr.imgUrl.jpeg}" alt="${attr.title}" loading="lazy" decoding="async"/>
        </picture>
        <div class="content">
            <h3 class="tracking-tight">${attr.title}</h3>
            <p>
                <ndp-post-tags
                    date="${attr.date}"
                    author="${attr.author}"
                    category="${attr.category}"
                ></ndp-post-tags>
            </p>
            <p class="subtext">${attr.abstract}</p>
        </div>
    </a>
</article>
`;

class PostListItemComponent extends HTMLElement {
    constructor() {
        super();

        const args = {
            url: this.getAttribute('url'),
            imgUrl: {
                avif: this.getAttribute('avif'),
                webp: this.getAttribute('webp'),
                jpeg: this.getAttribute('jpeg')
            },
            title: this.getAttribute('title'),
            date: this.getAttribute('date'),
            author: this.getAttribute('author'),
            category: this.getAttribute('category'),
            abstract: this.getAttribute('abstract')
        };

        const content = document.createElement('div');
        content.innerHTML = template(args);

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
}

customElements.define("ndp-post-list-item", PostListItemComponent);

export default PostListItemComponent;