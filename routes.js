import 'router-slot';
import { HomeComponent } from './home/home.js';
import { PostComponent } from "./post/post.js";
import posts from './content/posts/meta.js';

const routes = [
    ...(posts.map(post => (
    {
        path: post.url,
        component: () => new PostComponent(post)
    }))),
    {
        path: "**",
        component: HomeComponent
    }
]

customElements.whenDefined("router-slot").then(async () => {
    const routerSlot = document.querySelector('router-slot');
    await routerSlot.add(routes);
});