import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { RiskAssessment } from '../models/RiskAssessment';
import { auth } from '../middleware/auth';
import { validateRiskAnalysis } from '../middleware/validate';
import { riskEngine } from '../services/riskEngine';
import { aiService } from '../services/aiService';

const router = Router();

router.post('/analyze', auth, validateRiskAnalysis, async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId } = req.body;
    
    let transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      if (req.body.amount) {
         transaction = req.body as any;
      } else {
         res.status(404).json({ error: 'Transaction not found' });
         return;
      }
    }
    
    const riskResult = riskEngine.analyze(transaction);
    const aiExplanation = await aiService.analyzeTransaction(transaction, riskResult);
    
    res.json({
      score: riskResult.score,
      level: riskResult.level,
      factors: riskResult.factors,
      aiExplanation: aiExplanation.explanation,
      aiConfidence: aiExplanation.confidence
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/summary', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const totalCount = await RiskAssessment.countDocuments();
    const highRisk = await RiskAssessment.countDocuments({ riskLevel: 'high' });
    const criticalRisk = await RiskAssessment.countDocuments({ riskLevel: 'critical' });
    
    res.json({
      totalAnalyzed: totalCount,
      highRisk,
      criticalRisk
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
