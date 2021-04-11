import { LitElement, html, css } from 'lit-element';
import { globalStyles } from '../../styles.js';

export class FeaturedWorkComponent extends LitElement {
    static get styles() {
        return [
            ...globalStyles,
            css`
                .projects {
                    display: flex;
                    flex-direction: column;
                }
                
                @media (min-width: 1024px) {  
                    .projects {
                        flex-direction: row;
                    }
                }
                
                slot::slotted(*) {
                    flex: 1 1 0px;
                }
            `
        ];
    }

    render() {
        return html`
            <section>
                <h2>Featured Work</h2>
                <slot class="projects"></slot>
            </section>
        `;
    }
}

customElements.define('ndp-featured-work', FeaturedWorkComponent);