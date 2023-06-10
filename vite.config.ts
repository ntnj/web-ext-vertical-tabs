import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import { getManifest } from './src/manifest.ts';

export default defineConfig(({ mode }) => {
  return {
    build: {
      minify: false,
      outDir: `dist/${mode}`,
      rollupOptions: {
        input: {
          sidebar: resolve(__dirname, 'sidebar.html'),
          background: resolve(__dirname, 'src/background.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          manualChunks: {
            // Doesn't work with --watch
            react: ['react', 'react-dom'],
            // react: [],
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            content: [
              './src/**/*.tsx',
            ],
          }),
        ],
      },
    },
    plugins: [
      {
        name: 'generate-manifest',
        buildStart() {
          this.addWatchFile('src/manifest.ts');
        },
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'manifest.json',
            source: getManifest(mode),
          });
        },
      },
    ],
  };
});