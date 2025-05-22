import { UserConfig, defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.json';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_ECOTIME_PWA_VERSION),
  },
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: [
          `
        @import "./src/assets/scss/_et.defaultTheme.module.scss";
        @import './src/css/utilities/index.scss';
      `,
        ],
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    splitVendorChunkPlugin(),
    viteTsconfigPaths(),
    VitePWA({
      includeManifestIcons: true,
      registerType: 'autoUpdate',
      manifest,
      includeAssets: [
        'favicon.svg',
        'aboutImage.png',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'out.svg',
        'in.svg',
        'registrationSuccess.svg',
        'authenticationFailed',
        'tansfer.svg',
        'timeOff.svg',
        'hbsLogo.svg',
      ],
      // switch to "true" to enable sw on development
      devOptions: {
        // enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg}'],
      },
    }),
  ] as UserConfig['plugins'],
  build: {
    assetsInlineLimit: 100,
    rollupOptions: {
      output: {
        // eslint-disable-next-line consistent-return
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
});
