import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // https://vitejs.dev/config/
import svgr from 'vite-plugin-svgr';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import htmlPlugin from 'vite-plugin-html-config';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = {
  title: 'Built-in AI challenge',
  description: '',
  images: {
    facebook: false,
    twitter: false,
  },
};

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssNesting, autoprefixer, postcssPresetEnv],
    },
  },
  ...(fs.existsSync(process.env.SSL_KEY || '') &&
  fs.existsSync(process.env.SSL_CRT || '')
    ? {
        server: {
          https: {
            key: fs.readFileSync(process.env.SSL_KEY || ''),
            cert: fs.readFileSync(process.env.SSL_CRT || ''),
          },
          port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
        },
      }
    : {}),
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    htmlPlugin({
      title: app.title,
      metas: [
        {
          name: app.title,
          content: app.description,
        },
        ...(app?.images?.facebook
          ? [
              {
                name: 'og:image',
                content: app.images.facebook,
              },
            ]
          : []),
        {
          name: 'og:title',
          content: app.title,
        },
        {
          name: 'og:description',
          content: app.description,
        },
        {
          name: 'og:locale',
          content: 'en_US',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: '@nic_o_martin',
        },
        {
          name: 'twitter:title',
          content: app.title,
        },
        {
          name: 'twitter:description',
          content: app.description,
        },
        ...(app?.images?.twitter
          ? [
              {
                name: 'twitter:image',
                content: app.images.twitter,
              },
            ]
          : []),
      ],
    }),
  ],
});
