import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el sitio en /<nombre-del-repositorio>/.
// Cambia REPOSITORY_NAME si el repositorio se llama distinto, o define BASE_PATH
// (el workflow de despliegue lo calcula automáticamente a partir del repositorio).
const REPOSITORY_NAME = 'proyecto-ruteo-cargas';
const PRODUCTION_BASE = process.env.BASE_PATH ?? `/${REPOSITORY_NAME}/`;

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? PRODUCTION_BASE : '/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
}));
