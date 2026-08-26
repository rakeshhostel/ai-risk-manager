import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { RiskAssessment } from '../models/RiskAssessment';
import { auth } from '../middleware/auth';
import { validateTransaction } from '../middleware/validate';
import { riskEngine } from '../services/riskEngine';
import { aiService } from '../services/aiService';
import { Alert } from '../models/Alert';

const router = Router();

router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query: any = status ? { status: String(status) } : {};
    
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const total = await Transaction.countDocuments(query);
    
    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.id });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    const riskAssessment = await RiskAssessment.findOne({ transactionId: req.params.id });
    
    res.json({
      transaction,
      riskAssessment
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, validateTransaction, async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    
    // Auto trigger risk analysis
    const riskResult = riskEngine.analyze(transaction);
    const aiExplanation = await aiService.analyzeTransaction(transaction, riskResult);
    
    const riskAssessment = new RiskAssessment({
      transactionId: transaction.transactionId,
      riskScore: riskResult.score,
      riskLevel: riskResult.level,
      decision: riskResult.decision,
      factors: riskResult.factors,
      aiExplanation: aiExplanation.explanation,
      aiConfidence: aiExplanation.confidence
    });
    
    await riskAssessment.save();
    
    // Create alert if high or critical
    if (riskResult.level === 'high' || riskResult.level === 'critical') {
      const alert = new Alert({
        type: 'Fraud Risk',
        severity: riskResult.level,
        title: `${riskResult.level.toUpperCase()} Risk Detected`,
        description: `Transaction ${transaction.transactionId} flagged as ${riskResult.level} risk.`,
        transactionId: transaction.transactionId,
        customerId: transaction.customerId
      });
      await alert.save();
    }
    
    // Update transaction status based on decision
    if (riskResult.decision === 'block') {
      transaction.status = 'blocked';
    } else if (riskResult.decision === 'review') {
      transaction.status = 'under_review';
    }
    await transaction.save();

    res.status(201).json({ transaction, riskAssessment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
