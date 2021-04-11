import { html, css } from '../lib/ndp.js';
import './logos/github.js';
import './logos/linkedin.js';
import './logos/twitter.js';

const styles = css`
@import '/styles.css';

nav {
    display: flex;
    flex-grow: 1;
    padding-top: var(--size-2);
    justify-content: center;
}

@media (min-width: 640px) {   
    nav {    
         justify-content: flex-end;
    } 
}

ndp-github, ndp-linkedin, ndp-twitter {
    display: inline-block;
    margin-right: var(--size-1_5);
    height: var(--size-5);
    width: var(--size-5);
}
`;

const template = html`
<nav>
    <a href="https://github.com/tkp1n" alt="GitHub"><ndp-github></ndp-github></a>
    <a href="https://www.linkedin.com/in/ndportmann/" alt="LinkedIn"><ndp-linkedin></ndp-linkedin></a>
    <a href="https://twitter.com/tkp1n" alt="Twitter"><ndp-twitter></ndp-twitter></a>
</nav>
`;

class NavComponent extends HTMLElement {
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

customElements.define("ndp-nav", NavComponent);

export default NavComponent;