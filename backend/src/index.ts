import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './modals/Schema';
import favRoutes from './routes/FavRoutes'



const app: Application = express();

// Configuration validation
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

if (!process.env.PORT) {
    throw new Error('PORT environment variable is not defined');
}

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors())

const sql = neon(process.env.DATABASE_URL as string);
export const db = drizzle(sql, { schema })

app.use('/api/favorites', favRoutes)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is healthy' });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})