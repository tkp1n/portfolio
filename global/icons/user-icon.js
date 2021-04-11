import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';
`;

const template = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg>
`;

class UserIconComponent extends HTMLElement {
    constructor() {
        super();

        const content = document.createElement('div');
        content.innerHTML = template;

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
};

customElements.define("ndp-user-icon", UserIconComponent);

export default UserIconComponent;