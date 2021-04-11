import { html, css } from '../lib/ndp.js';
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

const styles = css`
@import '/styles.css';

.home-elements {
    max-width: 1024px;
}

.inner {
    margin-top: var(--size-10);
    max-width: 768px;
}
`;

const template = attr => html`
<div class="container mx-auto home-elements">
    <ndp-nav></ndp-nav>
    <ndp-home-header></ndp-home-header>
    <ndp-featured-work>
        ${projects.map(project => `
            <ndp-project
                title="${project.title}"
                description="${project.description}"
                blogPostUrl="${project.blogPostUrl}"
                gitHubUrl="${project.gitHubUrl}"
                ${project.nuGetUrl ? `nuGetUrl="${project.nuGetUrl}"` : ''}
            ></ndp-project>
        `)}
    </ndp-featured-work>
    <div class="container mx-auto inner">
        <ndp-contributions>
            ${contributions.map(contrib => `
                <ndp-contribution
                    repo-img="${contrib.repoImg}"
                    pr-url="${contrib.prUrl}"
                    pr-title="${contrib.prTitle}"
                ></ndp-contribution>
            `).join('<hr/>')}
        </ndp-contributions>
        <ndp-post-list>
            ${attr.posts.map(post => `
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

class HomeComponent extends HTMLElement {
    constructor() {
        super();

        const content = document.createElement('div');
        content.innerHTML = template({posts});

        const style = document.createElement('style');
        style.textContent = styles;

        const shadowRoot = this.attachShadow({mode: 'open'});
        
        shadowRoot.append(style, ...content.children);
    }
}

customElements.define("ndp-home", HomeComponent);

export default HomeComponent;