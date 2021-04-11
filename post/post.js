import { html, css } from '../lib/ndp.js';
import './post-header.js';
import '../global/post-tags.js';
import '../global/footer.js';

const styles = css`
@import '/styles.css';
@import '/obsidian.css';
@import '/katex.css';

h1 {
    font-size: var(--size-6);
    line-height: var(--size-8);
    margin-top: var(--size-7);
}

@media (min-width: 1024px) {
    h1 {
        font-size: var(--size-7);
        line-height: var(--size-9);
    }
}

h1, h2, h3, h4, h5, h6 {
    margin-left: 0;
}

.content {
  max-width: 768px;
  margin-top: var(--size-6);
  padding-right: var(--size-5);
  padding-left: var(--size-5);
}

.text {
  margin-top: var(--size-2);
  font-size: var(--size-4);
}
  
.text p {
  padding-top: var(--size-4);
}
  
.text a {
  color: var(--blue-500);
}
  
.text a:hover{
  text-decoration: underline;
}

.text pre {
  margin-top: var(--size-1);
  margin-bottom: var(--size-1);
}
  
.text table {
    table-layout: auto;
    width: 100%;
    margin-top: var(--size-2);
    margin-bottom: var(--size-2);
}
  
.text tr {
    border-bottom-width: 1px;
}
  
.text td {
    padding: var(--size-1_5);
}

.text code {
    border-radius: var(--size-1);
    padding: var(--size-0_5);
    background-color: var(--gray-200);
}

.text pre > code {
  margin-top: var(--size-2);
  background-color: var(--gray-800);
  padding: var(--size-2);
}
  
/* markdown quotes */
.text blockquote {
  border-radius: var(--size-1);
  border-left-width: 2px;
  border-color: var(--gray-500);
  padding-left: var(--size-2);
  padding-right: var(--size-1);
  margin-top: var(--size-4);
  margin-bottom: var(--size-2);
}

.text blockquote > p {
  padding-top: 0;
}
`;

const template = (attr) => html`
<ndp-post-header></ndp-post-header>
<div class="content container mx-auto">
    <h1>${attr.title}</h1>
    <p>
        <ndp-post-tags
                date="${attr.date}"
                author="${attr.author}"
                category="${attr.category}"
        ></ndp-post-tags>
    </p>
    <article class="text">
        ${attr.html}
    </article>
</div>
<ndp-footer></ndp-footer>
`;

class PostComponent extends HTMLElement {
    post;

    constructor() {
        super();
    }

    connectedCallback() {
        this.post.html.then(result => {
            const data = {
                ...this.post,
                html: result.CONTENT
            }

            const content = document.createElement('div');
            content.innerHTML = template(data);

            const style = document.createElement('style');
            style.textContent = styles;

            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.append(style, ...content.children);
        });
    }
}

customElements.define("ndp-post", PostComponent);

export default PostComponent;