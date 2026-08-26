import { Router, Request, Response } from 'express';
import { RiskRule } from '../models/RiskRule';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const rules = await RiskRule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const rule = await RiskRule.findOneAndUpdate({ ruleId: req.params.id }, req.body, { new: true });
    if (!rule) {
      res.status(404).json({ error: 'Rule not found' });
      return;
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
