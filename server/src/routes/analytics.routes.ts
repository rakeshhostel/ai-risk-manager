import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { RiskAssessment } from '../models/RiskAssessment';
import { Alert } from '../models/Alert';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const highRisk = await RiskAssessment.countDocuments({ riskLevel: 'high' });
    const critical = await RiskAssessment.countDocuments({ riskLevel: 'critical' });
    const underReview = await Transaction.countDocuments({ status: 'under_review' });
    const fraudPrevented = await Transaction.countDocuments({ status: 'blocked' });
    
    const riskAssessments = await RiskAssessment.find();
    const riskDistribution = {
      low: riskAssessments.filter(r => r.riskLevel === 'low').length,
      medium: riskAssessments.filter(r => r.riskLevel === 'medium').length,
      high: riskAssessments.filter(r => r.riskLevel === 'high').length,
      critical: riskAssessments.filter(r => r.riskLevel === 'critical').length,
    };
    
    const recentTransactions = await Transaction.find().sort({ timestamp: -1 }).limit(5);
    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({
      totalTransactions,
      highRisk,
      critical,
      underReview,
      fraudPrevented,
      riskDistribution,
      recentTransactions,
      recentAlerts
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/trends', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    // Mock trends for demo
    const trends = [
      { date: '2023-01-01', count: 120 },
      { date: '2023-01-02', count: 150 }
    ];
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/distribution', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const low = await RiskAssessment.countDocuments({ riskLevel: 'low' });
    const medium = await RiskAssessment.countDocuments({ riskLevel: 'medium' });
    const high = await RiskAssessment.countDocuments({ riskLevel: 'high' });
    const critical = await RiskAssessment.countDocuments({ riskLevel: 'critical' });
    
    res.json({ low, medium, high, critical });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
