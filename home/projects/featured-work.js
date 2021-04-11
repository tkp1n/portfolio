import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';

.projects {
    display: flex;
    flex-direction: column;
}

@media (min-width: 1024px) {
    .projects {
        flex-direction: row;
    }
}

slot::slotted(*) {
    flex: 1 1 0px;
}
`;

const template = html`
<section>
    <h2>Featured Work</h2>
    <slot class="projects"></slot>
</section>
`;

class FeaturedWorkComponent extends HTMLElement {
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

customElements.define('ndp-featured-work', FeaturedWorkComponent);

export default FeaturedWorkComponent;