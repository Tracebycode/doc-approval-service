import express from 'express';


const app = express();


app.use(express.json());




// Importing and using auth routes
import authRoutes from './routes/auth.routes';
app.use('/api', authRoutes);

// Importing and using post routes
import postRoutes from './routes/post.routes';
app.use('/api/posts', postRoutes);


export default app;

