import { Router, Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, entityType, limit = 50, page = 1 } = req.query;
    const query: any = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const total = await AuditLog.countDocuments(query);
    
    res.json({
      logs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
