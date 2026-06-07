import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import storesRoutes from './modules/stores/stores.routes';
import ratingsRoutes from './modules/ratings/ratings.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
