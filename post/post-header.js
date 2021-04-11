import { html, css } from '../lib/ndp.js';

const styles = css`
@import '/styles.css';

h1 {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

@media (min-width: 1024px) {
    h1 {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
}

.sub {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: var(--weight-extralight);
}

@media (min-width: 1024px) {
    .sub {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}

.outer {
    margin-top: var(--size-8);
    background-color: var(--blue-600);
    transform: skewY(6deg);
    width: 66.666667%;
    max-width: var(--size-xs);
    min-width: -webkit-min-content;
    min-width: min-content;
}

@media (min-width: 1024px) {
    .outer {
        max-width: var(--size-md);
    }
}

.inner {
    padding: var(--size-2);
    background-color: var(--white);
    transform: skewY(-6deg);
    width: 80%;
}
`;

const template = html`
<a href="/">
    <div class="outer shadow rounded mx-auto">
        <div class="inner shadow rounded mx-auto">
            <header>
                <h1>Nicolas Portmann</h1>
                <p class="sub">Software Engineer</p>
            </header>
        </div>
    </div>
</a>
`;

class PostHeaderComponent extends HTMLElement {
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

customElements.define("ndp-post-header", PostHeaderComponent);

export default PostHeaderComponent;