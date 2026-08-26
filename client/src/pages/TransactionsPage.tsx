import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import api from '../services/api';
import { Transaction, RiskAssessment } from '../types';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assessments, setAssessments] = useState<Record<string, RiskAssessment>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
        if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
        if (filters.search) params.append('search', filters.search);
        
        const res = await api.get(`/transactions?${params.toString()}`);
        const data = res.data;
        setTransactions(data.transactions || data);
        
        // Build assessments map
        if (data.assessments) {
          const map: Record<string, RiskAssessment> = {};
          data.assessments.forEach((a: RiskAssessment) => { map[a.transactionId] = a; });
          setAssessments(map);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor and analyze payment transactions</p>
      </div>
      <TransactionFilters onFilterChange={setFilters} />
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TransactionTable transactions={transactions} assessments={assessments} />
      )}
    </motion.div>
  );
};
