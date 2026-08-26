import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { auth } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/investigate', auth, aiLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, context } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }
    
    const response = await aiService.investigate(query, context);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
