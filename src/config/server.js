import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import aiRoutes from '../routes/aiRoutes.js'
import taskRoutes from '../routes/tasksRoutes.js'
import checkoutRoutes from "../routes/checkoutRoute.js";
import paymentWebhook from '../routes/paymentsWebhook.js';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://uni-task-lime.vercel.app",
    "https://untroublesome-vaulted-vennie.ngrok-free.dev",
    "https://uni-task-2vya64uc0-arissongalias-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/ai', aiRoutes);     
app.use('/api/tasks', taskRoutes); 
app.use("/api", checkoutRoutes);
app.use("/api", paymentWebhook);

app.get('/', (req, res) => {
  res.send('AI Server Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});