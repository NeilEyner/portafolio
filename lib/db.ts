// lib/db.ts
// Conexión singleton a PostgreSQL usando Drizzle ORM
// Requiere: DATABASE_URL en .env.local

import { drizzle } from "drizzle-orm/postgres-js";
import postgres   from "postgres";
import * as schema from "./schema.drizzle";

// Evitar múltiples conexiones en desarrollo (hot reload de Next.js)
declare global {
  // eslint-disable-next-line no-var
  var _sqlConexion: ReturnType<typeof postgres> | undefined;
}

const conexionSql = globalThis._sqlConexion ?? postgres(process.env.DATABASE_URL!, {
  max: 10,           // máximo de conexiones en el pool
  idle_timeout: 20,  // segundos antes de cerrar conexiones inactivas
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== "production") {
  globalThis._sqlConexion = conexionSql;
}

export const db = drizzle(conexionSql, { schema });