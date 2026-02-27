// drizzle.config.ts
// Configuración para Drizzle Kit (migraciones y push a la DB)
// Comandos útiles:
//   npx drizzle-kit generate   → genera archivos de migración
//   npx drizzle-kit migrate    → aplica migraciones a la DB
//   npx drizzle-kit push       → push directo sin migraciones (dev)
//   npx drizzle-kit studio     → abre el explorador visual de la DB

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema:    "./lib/schema.drizzle.ts",   // ruta a tu schema de Drizzle
  out:       "./drizzle",                  // carpeta donde se generan las migraciones
  dialect:   "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose:   true,
  strict:    true,
});