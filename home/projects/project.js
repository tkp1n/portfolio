import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';
.card {
    margin: var(--size-3);
    margin-bottom: 0;
    padding: var(--size-2);
    height:100%;
    display:flex;
    flex-direction:column;
}

h3 {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: var(--size-4_5);   
    line-height: var(--size-7);
    font-weight: 600;
    margin-top: 0;
}

@media (min-width: 1024px) {
    h3 {
        font-size: var(--size-5);
    }
}

.subtext {
    color: var(--gray-800);
    letter-spacing: -0.025em;
    flex-grow: 1;
}

@media (min-width: 1024px) {
    .subtext {
        font-size: var(--size-4_5);
        line-height: var(--size-7);
    }
}

.links {
    display: flex;
}

.btn {
    padding-right: var(--size-1);
    padding-left: var(--size-1);
    margin-right: var(--size-2);
    color: var(--blue-800);
    border-width: 1px;
    border-radius: var(--size-1_5);
}

.btn:hover {
    color: var(--white);
    background-color: var(--blue-500);
    border-color: transparent;
}
`;

const template = attr => html`
<article class="card rounded shadow">
    <h3>${attr.title}</h3>
    <p class="subtext">${attr.description}</p>
    <div class="links">
        <a href="${attr.blogPostUrl}" class="btn border">Blog Post</a>
        <a href="${attr.gitHubUrl}" class="btn border">GitHub</a>
        ${attr.nuGetUrl ? `<a href="${attr.nuGetUrl}" class="btn border">NuGet</a>` : ''}
    </div>
</article>
`;

class ProjectComponent extends HTMLElement {
    constructor() {
        super();

        const attributes = {
            title: this.getAttribute('title'),
            description: this.getAttribute('description'),
            blogPostUrl: this.getAttribute('blogPostUrl'),
            gitHubUrl: this.getAttribute('gitHubUrl'),
            nuGetUrl: this.getAttribute('nuGetUrl')
        };

        const content = document.createElement('div');
        content.innerHTML = template(attributes);

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
}

customElements.define('ndp-project', ProjectComponent);

export default ProjectComponent;