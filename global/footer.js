import { html, css } from '../lib/ndp.js';

const styles = css`
@import '/styles.css';
footer {
    margin-top: var(--size-5);
    margin-bottom: var(--size-2);
    display: flex;
    justify-content: center;
}
`;

const template = (attr) => html`
<footer>
    <p class="text-xs">&#169; ${attr.year} - Nicolas Portmann</p>
</footer>
`;

class FooterComponent extends HTMLElement {
    constructor() {
        super();

        const attributes = {
            year: new Date().getFullYear()
        };

        const content = document.createElement('div');
        content.innerHTML = template(attributes);

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.append(style, ...content.children);
    }
};

customElements.define("ndp-footer", FooterComponent);

export default FooterComponent;