import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from '../routes/aiRoutes.js'
import taskRoutes from '../routes/tasksRoutes.js'
import checkoutRoutes from "../routes/checkoutRoute.js";
import paymentWebhook from '../routes/paymentsWebhook.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});