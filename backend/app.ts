import express from 'express';
import { json, urlencoded} from 'express';
import { apiRouter } from './routes/api.routes';
import cors from "cors";

const app = express();

app.use(json());
app.use(cors())
app.use(urlencoded({ extended: true }));

// API Routes
app.use('/', apiRouter);

export default app;
