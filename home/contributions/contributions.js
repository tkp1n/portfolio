import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';
div {
    padding-bottom: var(--size-1);
}
`;

const template = html`
<section>
    <h2>OSS Contributions</h2>
    <div class="shadow rounded">
        <slot></slot>
    </div>
</section>
`;

class ContributionsComponent extends HTMLElement {
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

customElements.define('ndp-contributions', ContributionsComponent);

export default ContributionsComponent;