import { Request, Response, NextFunction } from 'express';

export const validateTransaction = (req: Request, res: Response, next: NextFunction): void => {
  const { transactionId, customerId, amount, paymentMethod } = req.body;
  if (!transactionId || !customerId || amount === undefined || !paymentMethod) {
    res.status(400).json({ error: 'Missing required transaction fields' });
    return;
  }
  next();
};

export const validateRiskAnalysis = (req: Request, res: Response, next: NextFunction): void => {
  const { transactionId } = req.body;
  if (!transactionId && !req.body.amount) {
    res.status(400).json({ error: 'Missing transaction data for analysis' });
    return;
  }
  next();
};
