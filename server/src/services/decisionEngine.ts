export const decisionEngine = {
  evaluate(score: number): { level: string; decision: string } {
    if (score >= 0 && score <= 29) {
      return { level: 'low', decision: 'approve' };
    } else if (score >= 30 && score <= 59) {
      return { level: 'medium', decision: 'monitor' };
    } else if (score >= 60 && score <= 79) {
      return { level: 'high', decision: 'review' };
    } else {
      return { level: 'critical', decision: 'block' };
    }
  }
};
