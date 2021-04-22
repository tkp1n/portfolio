import 'router-slot';
import { HomeComponent } from './home/home.js';
import posts from './content/posts/meta.js';

const createComponentForPost = (post) => async () => {
    const data = await post.html();
    post.content = data.CONTENT;

    const component = await import('./post/post.js');
    return new(component.default)(post);
};

const routes = [
    ...(posts.map(post => (
    {
        path: post.url,
        component: createComponentForPost(post)
    }))),
    {
        path: '**',
        component: HomeComponent
    }
]

customElements.whenDefined('router-slot').then(async () => {
    const routerSlot = document.querySelector('router-slot');
    await routerSlot.add(routes);
});

window.addEventListener('navigationend', () => {
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
});