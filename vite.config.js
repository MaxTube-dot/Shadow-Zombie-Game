import { defineConfig } from 'vite'
import {viteSingleFile} from "vite-plugin-singlefile";
import inline from 'vite-plugin-inline';

export default defineConfig({
    base: './', // Указываем относительный путь
    plugins: [
        inline(),
        viteSingleFile(),
    ], // Встраивает всё в один HTML-файл
    build: {
        assetsInlineLimit: 100000000, // Увеличиваем лимит для встраивания ресурсов
    },
    assetsInclude: ['**/*.glb', '**/*.gltf'], // Добавляем поддержку GLB/GLTF
    server: {
        hmr: false, // Отключаем HMR
    },
})