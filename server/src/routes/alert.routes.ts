import { Router, Request, Response } from 'express';
import { Alert } from '../models/Alert';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, severity } = req.query;
    const query: any = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
