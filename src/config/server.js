import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from '../routes/ai.js'
import taskRoutes from '../routes/tasks.js'
import paymentRoutes from '../routes/payments.js'
import checkoutRoutes from "../routes/checkout.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);     
app.use('/api/tasks', taskRoutes); 
app.use("/api", checkoutRoutes);

app.get('/', (req, res) => {
  res.send('AI Server Running');
});

app.use('/api/payments', paymentRoutes)

app.listen(5000, () => {
  console.log('Server running on port 5000');
});