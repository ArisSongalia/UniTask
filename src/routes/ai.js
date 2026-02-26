import { analyzeTask } from "../services/backend/aiServices.js";
import express from 'express';

const router = express.Router();

router.post('/analyze-task', async (req, res) => {
  try {
    const { task } = req.body;

    const result = await analyzeTask(task);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI failed' });
  }
});

export default router;