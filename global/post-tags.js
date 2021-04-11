import { html, css } from '../lib/ndp.js';
import './icons/calendar-icon.js';
import './icons/tag-icon.js';
import './icons/user-icon.js';

const styles = css`
@import '/styles.css';
.meta {
    font-size: var(--size-3_5);
    line-height: var(--size-5);
    font-weight: var(--weight-light);
    margin-right: var(--size-3);
}
`;

const template = attr => html`
<section>
    <ndp-calendar-icon></ndp-calendar-icon>
    <span class="meta">${attr.date}</span>
    <ndp-user-icon></ndp-user-icon>
    <span class="meta">${attr.author}</span>
    <ndp-tag-icon></ndp-tag-icon>
    <span class="meta">${attr.category}</span>
</section>
`;

class PostTagsComponent extends HTMLElement {
    constructor() {
        super();

        const attr = {
            date: this.getAttribute('date'),
            author: this.getAttribute('author'),
            category: this.getAttribute('category')
        };

        const content = document.createElement('div');
        content.innerHTML = template(attr);

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
};

customElements.define("ndp-post-tags", PostTagsComponent);

export default PostTagsComponent;