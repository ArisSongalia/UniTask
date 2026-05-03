import express from 'express';
import {
  analyzeTask,
  createProjectWithAI
} from '../services/backend/aiServices.js';

const router = express.Router();

router.post('/analyze-task', async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({
        error: 'Task title is required'
      });
    }

    const result = await analyzeTask(task);

    res.json(result);

  } catch (error) {
    console.error('analyze-task error:', error);

    res.status(500).json({
      error: 'AI analyze failed'
    });
  }
});

router.post('/create-ai-project', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    const result = await createProjectWithAI(prompt);

    res.json(result);

  } catch (error) {
    console.error('create-ai-project error:', error);

    res.status(500).json({
      error: 'AI project generation failed'
    });
  }
});

export default router;