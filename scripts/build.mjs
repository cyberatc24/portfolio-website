import { build } from 'esbuild';
import { cp, rm, mkdir } from 'node:fs/promises';

// 1. Bundle the app next to the source, so index.html works when served from the project root.
await build({ entryPoints: ['src/app.jsx'], bundle: true, minify: true, sourcemap: true, outfile: 'Asset/dist/app.js', loader: { '.jsx': 'jsx' }, jsx: 'automatic', target: ['es2020'], define: { 'process.env.NODE_ENV': '"production"' } });

// 2. Copy everything the live site needs into dist/, the folder Netlify (or any static host) publishes.
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await cp('index.html', 'dist/index.html');
await cp('Asset', 'dist/Asset', { recursive: true, filter: src => !src.endsWith('.map') });

console.log('Portfolio built: dist/ (index.html + Asset/) ready to publish');
