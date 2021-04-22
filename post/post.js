import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { globalStyles } from '../styles.js';
import { codeStyles } from '../codeStyles.js';
import './post-header.js';
import '../global/post-tags.js';
import '../global/footer.js';
import CommentRepository from '../lib/runtime/comments.js';

export default class PostComponent extends LitElement {
    static get properties() {
        return {
            post: { type: String },
            title: { type: String },
            date: { type: String },
            author: { type:String },
            category: { type:String },
        };
    }

    static get styles() {
        return [
            ...globalStyles,
            ...codeStyles,
            css`
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
                color: var(--blue-600);
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
            `
        ]
    }

    constructor(data) {
        super();
        this.post = data.content;
        this.title = data.title;
        this.date = new Date(data.date).toLocaleDateString();
        this.author = data.author;
        this.category = data.category;

        /*
        new CommentRepository('http://localhost:10002/devstoreaccount1', 'st=2021-04-17T19%3A25%3A18Z&se=2099-04-18T19%3A25%3A00Z&sp=r&sv=2018-03-28&tn=comments&sig=SowifuHkuJTyi%2BIUCaNON3nQyTG1edgiZVU7m6S0U9A%3D')
            .top('asdf', 3)
            .then(res => console.log(res));
         */
    }

    render() {
        return html`
            <ndp-post-header></ndp-post-header>
            <div class="content container mx-auto">
                <h1>${this.title}</h1>
                <p>
                    <ndp-post-tags
                            date="${this.date}"
                            author="${this.author}"
                            category="${this.category}"
                    ></ndp-post-tags>
                </p>
                <article class="text">
                    ${unsafeHTML(this.post)}
                </article>
            </div>
            <ndp-footer></ndp-footer>
        `;
    }
}

customElements.define("ndp-post", PostComponent);