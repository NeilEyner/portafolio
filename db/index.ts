import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as esquema from './esquema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const cadenaConexion = process.env.DATABASE_URL;

// Cliente para consultas
export const cliente = postgres(cadenaConexion);
export const bd = drizzle(cliente, { schema: esquema });
