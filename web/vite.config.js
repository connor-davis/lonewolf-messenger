import { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    nodePolyfills({
      include: [
        '*.js',
        'node_modules/**/*.js',
        // (1)
        new RegExp('node_modules/.vite/.*js'),
      ],
      // (2)
      exclude: ['node_modules/polyfill-nodeglobal.js'],
    }),
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      base: '/',
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true,
      },
      id: '/',
      includeAssets: [
        './src/robots.txt',
        './src/assets/lonewolf-16.png',
        './src/assets/lonewolf-32.png',
        './src/assets/lonewolf-64.png',
        './src/assets/lonewolf-128.png',
        './src/assets/lonewolf-144.png',
        './src/assets/lonewolf-192.png',
        './src/assets/lonewolf-256.png',
        './src/assets/lonewolf-512.png',
      ],
      strategies: 'injectManifest',
      manifest: {
        short_name: 'LoneWolf',
        name: 'LoneWolf Messenger',
        icons: [
          {
            src: '/assets/lonewolf-16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-64.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/lonewolf-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        theme_color: '#000000',
        background_color: '#ffffff',
      },
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: true,
  },
});
