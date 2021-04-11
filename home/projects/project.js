import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class ProjectComponent extends LitElement {
    static get properties() {
        return {
            title: {type: String},
            description: {type: String},
            blogPostUrl: {type: String},
            gitHubUrl: {type: String},
            nuGetUrl: {type: String}
        }
    }

    static get styles() {
        return [
            ...globalStyles,
            css`
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
            `
        ]
    }

    render() {
        return html`
            <article class="card rounded shadow">
                <h3>${this.title}</h3>
                <p class="subtext">${this.description}</p>
                <div class="links">
                    <a href="${this.blogPostUrl}" class="btn border">Blog Post</a>
                    <a href="${this.gitHubUrl}" class="btn border">GitHub</a>
                    ${(this.nuGetUrl !== "undefined") ? 
                    html`<a href="${this.nuGetUrl}" class="btn border">NuGet</a>` : 
                    html``}
                </div>
            </article>
        `;
    }
}

customElements.define('ndp-project', ProjectComponent);