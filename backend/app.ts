import express from 'express';
import { json, urlencoded } from 'express';


const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

// API Routes
// app.use('/api', apiRouter);

export default app;
