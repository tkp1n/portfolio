import { html, css } from '../../lib/ndp.js';

const styles = css`
@import '/styles.css';

.container {
    margin: var(--size-2);
    padding-top: var(--size-2);
}

img {
    display: inline;
    width: var(--size-5);
    height: var(--size-5);
    margin-right: var(--size-2);
    margin-bottom: var(--size-1);
    border-radius: var(--size-0_5);
}

a {
    color: var(--blue-500);
}

@media (min-width: 1024px) {
    a {
        font-size: var(--size-4_5);
        line-height: var(--size-7);
    }
}

a:hover {
    text-decoration: underline; 
}

.repo {
    color: var(--gray-500);
    font-weight: 600;
}

.pr {
    color: var(--black);
}
`;

const template = (attr) => html`
<div class="container">
    <p>
        <img src="${attr.repoImg}" alt="${attr.repoName}"/>
        <a href="${attr.repoUrl}" class="repo">${attr.repoName}</a>
    </p>
    <p>
        <a href="${attr.prUrl}" class="pr">${attr.prId}: ${attr.prTitle}</a>
    </p>
</div>
`;

class ContributionComponent extends HTMLElement {
    constructor() {
        super();

        const attributes = this.makeArgs();
        
        const content = document.createElement('div');
        content.innerHTML = template(attributes);

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.append(style, ...content.children);
    }

    makeArgs() {
        const prUrl = this.getAttribute('pr-url');
        const prUrlParts = prUrl.split('/');
        const repoUrl = prUrlParts.slice(0, prUrlParts.length - 2).join('/');
        const repoUrlParts = repoUrl.split('/');
        const repoName = repoUrlParts.slice(repoUrlParts.length - 2).join('/');

        return {
            repoUrl,
            repoName,
            repoImg: this.getAttribute('repo-img'),
            prId: `#${prUrlParts[prUrlParts.length - 1]}`,
            prUrl: this.getAttribute('pr-url'),
            prTitle: this.getAttribute('pr-title')
        };
    }
}

customElements.define('ndp-contribution', ContributionComponent);

export default ContributionComponent;