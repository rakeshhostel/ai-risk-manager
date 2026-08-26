import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/:id/risk-profile', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.params.id;
    const transactions = await Transaction.find({ customerId }).sort({ timestamp: -1 });
    
    if (transactions.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransactionValue = totalSpent / transactions.length;
    const failedTransactions = transactions.filter(t => t.status === 'failed').length;
    const blockedTransactions = transactions.filter(t => t.status === 'blocked').length;

    res.json({
      customerId,
      customerName: transactions[0].customerName,
      totalTransactions: transactions.length,
      totalSpent,
      avgTransactionValue,
      failedTransactions,
      blockedTransactions,
      history: transactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
