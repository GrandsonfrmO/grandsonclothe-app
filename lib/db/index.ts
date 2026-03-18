import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Configuration du connection pooling
const client = postgres(connectionString, {
  max: 10,              // Maximum 10 connexions dans le pool
  idle_timeout: 20,     // Fermer les connexions inactives après 20s
  connect_timeout: 10,  // Timeout de connexion de 10s
});

export const db = drizzle(client, { schema });
