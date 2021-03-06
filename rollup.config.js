import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';
import mdBuild from './lib/build/mdBuild.js';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'main.js',
	output: {
		dir: 'public',
		format: 'es',
		sourcemap: !production
	},
	plugins: [
		copy({
			targets: [
				{ src: './node_modules/highlight.js/styles/obsidian.css', dest: 'public'},
				{ src: './node_modules/katex/dist/katex.css', dest: 'public'}
			],
			copyOnce: true
		}),
		resolve(),
		mdBuild({
			baseUrl: 'https://salmon-coast-03ea6f003.azurestaticapps.net/',
			basePath: 'content/posts',
			targetPath: './public'
		}),
		minifyHTML(),
		production && terser() // minify, but only in production
	],
	preserveEntrySignatures: 'exports-only'
};