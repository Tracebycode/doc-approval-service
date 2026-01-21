import express from 'express';

const app = express();


app.use(express.json());


// Importing and using parser routes
import parserRoutes from './routes/parser.routes';
app.use('/api', parserRoutes);


export default app;

