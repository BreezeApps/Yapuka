import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react-swc"
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { builtinModules } from "module";
import { resolve } from "path";

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        // plugins: [externalizeDepsPlugin()],
        build: {
            lib: {
                entry:"out/preload/index.js",
                formats: ["cjs"],
            },
            rollupOptions: {
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js',
                    assetFileNames: '[name].[ext]'
                  },
              input: {
                index: resolve(__dirname, 'src/preload/index.ts')
              }
            }
          }
    },
    renderer: {
        plugins: [react()],
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                path: 'path-browserify',
            },
        },
        build: {
            rollupOptions: {
                external: [...builtinModules, "electron"],
                input: {
                    index: resolve(__dirname, 'index.html')
                  }
            }
        },
        define: {
            __dirname: JSON.stringify(__dirname),
        },
    },
});