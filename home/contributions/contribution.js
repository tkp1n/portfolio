import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class ContributionComponent extends LitElement {
    static get properties() {
        return {
            repoUrl: {type: String},
            repoName: {type: String},
            repoImg: {type: String},
            prId: {type: String},
            prUrl: {type: String},
            prTitle: {type: String}
        };
    }

    static get styles() {
        return [
            ...globalStyles,
            css`
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
            `
        ]
    }

    get repoUrl() {
        const prUrlParts = this.prUrl.split('/');
        return prUrlParts.slice(0, prUrlParts.length - 2).join('/');
    }

    get repoName() {
        const repoUrlParts = this.repoUrl.split('/');
        return repoUrlParts.slice(repoUrlParts.length - 2).join('/');
    }

    get prId() {
        const prUrlParts = this.prUrl.split('/');
        return `#${prUrlParts[prUrlParts.length - 1]}`;
    }

    render() {
        return html`
            <div class="container">
                <p>
                    <img src="${this.repoImg}" alt="${this.repoName}"/>
                    <a href="${this.repoUrl}" class="repo">${this.repoName}</a>
                </p>
                <p>
                    <a href="${this.prUrl}" class="pr">${this.prId}: ${this.prTitle}</a>
                </p>
            </div>
            `;
    }
}

customElements.define('ndp-contribution', ContributionComponent);