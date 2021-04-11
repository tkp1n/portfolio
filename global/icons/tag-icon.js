import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';
`;

const template = html`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
</svg>
`;

class CalendarTagComponent extends HTMLElement {
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

customElements.define("ndp-tag-icon", CalendarTagComponent);

export default CalendarTagComponent;