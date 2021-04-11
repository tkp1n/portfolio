import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { globalStyles } from '../styles.js';
import '../global/nav.js';
import './header.js';
import './projects/featured-work.js'
import './projects/project.js';
import './contributions/contributions.js';
import './contributions/contribution.js';
import './posts/posts.js';
import './posts/post.js';
import '../global/footer.js';
import projects from '../content/projects.js';
import contributions from '../content/contributions.js';
import posts from '../content/posts/meta.js';

export class HomeComponent extends LitElement {

    static get styles() {
        return [
            ...globalStyles,
            css`
              .home-elements {
                max-width: 1024px;
              }

              .inner {
                margin-top: var(--size-10);
                max-width: 768px;
              }
            `
        ]
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="container mx-auto home-elements">
                <ndp-nav></ndp-nav>
                <ndp-home-header></ndp-home-header>
                <ndp-featured-work>
                    ${projects.map(project => html`
                        <ndp-project
                            title="${project.title}"
                            description="${project.description}"
                            blogPostUrl="${project.blogPostUrl}"
                            gitHubUrl="${project.gitHubUrl}"
                            nuGetUrl="${project.nuGetUrl}"
                        ></ndp-project>
                    `)}
                </ndp-featured-work>
                <div class="container mx-auto inner">
                    <ndp-contributions>
                        ${unsafeHTML(contributions.map(contrib => `
                            <ndp-contribution
                                repoImg="${contrib.repoImg}"
                                prUrl="${contrib.prUrl}"
                                prTitle="${contrib.prTitle}"
                            ></ndp-contribution>
                        `).join('<hr/>'))}
                    </ndp-contributions>
                    <ndp-post-list>
                        ${posts.map(post => html`
                            <ndp-post-list-item
                                url="${post.url}"
                                avif="${post.imgUrls.avif}"
                                webp="${post.imgUrls.webp}"
                                jpeg="${post.imgUrls.jpeg}"
                                title="${post.title}"
                                date="${post.date}"
                                author="${post.author}"
                                category="${post.category}"
                                abstract="${post.abstract}"
                            ></ndp-post-list-item>
                        `)}
                    </ndp-post-list>
                </div>
            </div>
            <ndp-footer></ndp-footer>
        `;
    }
}

customElements.define("ndp-home", HomeComponent);