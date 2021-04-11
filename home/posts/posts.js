import { html, css } from '../../lib/ndp.js';
const styles = css`
@import '/styles.css';
`;

const template = html`
<section>
    <h2>Blog Posts</h2>
    <div>
        <slot></slot>
    </div>
</section>
`;

class PostListComponent extends HTMLElement {
    constructor() {
        super();

        const content = document.createElement('div');
        content.innerHTML = template;

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
}

customElements.define("ndp-post-list", PostListComponent);

export default PostListComponent;