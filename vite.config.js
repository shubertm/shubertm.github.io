import {defineConfig} from "vite";
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { plugin as markdownPlugin } from 'vite-plugin-markdown';

export default defineConfig(
    {
        plugins: [
            vue(),
            markdownPlugin({
                mode: ['vue', 'html'],
            }),
        ],
        base: "./",
        baseUrl: 'https://shubertm.github.io',
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    "bitcoin-freedom-money": resolve(__dirname, 'articles/bitcoin-freedom-money/index.html'),
                    "bitcoin-proof-of-work/analogy": resolve(__dirname, 'articles/bitcoin-proof-of-work/analogy/index.html'),
                    "bitcoin-proof-of-work/technical-dive": resolve(__dirname, 'articles/bitcoin-proof-of-work/technical-dive/index.html'),
                },
            },
        },
    }
)