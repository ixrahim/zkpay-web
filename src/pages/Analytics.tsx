// src/pages/Analytics.tsx

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/api/client';
import { 
  CategorySpending, 
  BudgetInsights, 
  FinancialHealthScore,
  SpendingComparison
} from '@/types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  AlertCircle,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export default function Analytics() {
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [budget, setBudget] = useState<BudgetInsights | null>(null);
  const [healthScore, setHealthScore] = useState<FinancialHealthScore | null>(null);
  const [comparison, setComparison] = useState<SpendingComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);

  useEffect(() => {
    loadAnalytics();
  }, [monthlyBudget]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [categoriesRes, budgetRes, healthRes, comparisonRes] = await Promise.all([
        analyticsAPI.getSpendingByCategory(),
        analyticsAPI.getBudget(monthlyBudget),
        analyticsAPI.getFinancialHealth(),
        analyticsAPI.getComparison(),
      ]);

      setCategories(categoriesRes.data.categories || []);
      setBudget(budgetRes.data.budget);
      setHealthScore(healthRes.data.healthScore);
      setComparison(comparisonRes.data.comparison);
    } catch (error) {
      console.error('Failed to load analytics', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // const getHealthColor = (rating: string) => {
  //   switch (rating) {
  //     case 'excellent': return 'text-green-600';
  //     case 'good': return 'text-blue-600';
  //     case 'fair': return 'text-yellow-600';
  //     default: return 'text-red-600';
  //   }
  // };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your spending and financial health</p>
      </div>

      {/* Health Score */}
      {healthScore && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Financial Health Score</h2>
                <p className="text-blue-100 text-sm">Overall rating: {healthScore.rating}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{healthScore.score}</div>
              <div className="text-sm text-blue-100">out of 100</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">Total Savings</div>
              <div className="text-2xl font-bold">£{healthScore.components.totalSavings.toFixed(2)}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">Avg Monthly Spending</div>
              <div className="text-2xl font-bold">£{healthScore.components.avgMonthlySpending.toFixed(2)}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">Savings Ratio</div>
              <div className="text-2xl font-bold">{healthScore.components.savingsRatio.toFixed(1)}x</div>
            </div>
          </div>
        </div>
      )}

      {/* Budget & Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget */}
        {budget && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Monthly Budget</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Spent this month</span>
                <span className={`font-medium px-2 py-1 rounded ${getBudgetStatusColor(budget.status)}`}>
                  {budget.status.replace('_', ' ')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    budget.percentageUsed > 100 ? 'bg-red-500' :
                    budget.percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-900 font-semibold">£{budget.totalSpent.toFixed(2)}</span>
                <span className="text-gray-600">of £{budget.monthlyBudget.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-600">Remaining</div>
                <div className="text-lg font-bold text-gray-900">£{budget.remaining.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Daily Budget</div>
                <div className="text-lg font-bold text-gray-900">£{budget.suggestedDailyBudget.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison */}
        {comparison && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Month Comparison</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">This Month</div>
                <div className="text-2xl font-bold text-gray-900">
                  £{comparison.thisMonth.spent.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {comparison.thisMonth.transactions} transactions
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Last Month</div>
                <div className="text-2xl font-bold text-gray-900">
                  £{comparison.lastMonth.spent.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {comparison.lastMonth.transactions} transactions
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              comparison.trend === 'increased' ? 'bg-red-50' : 
              comparison.trend === 'decreased' ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              {comparison.trend === 'increased' ? (
                <TrendingUp className="w-6 h-6 text-red-600" />
              ) : comparison.trend === 'decreased' ? (
                <TrendingDown className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-600" />
              )}
              <div>
                <div className={`font-bold ${
                  comparison.trend === 'increased' ? 'text-red-600' : 
                  comparison.trend === 'decreased' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {comparison.percentageChange > 0 ? '+' : ''}
                  {comparison.percentageChange.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {comparison.trend === 'increased' ? 'More than last month' :
                   comparison.trend === 'decreased' ? 'Less than last month' : 'Same as last month'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spending by Category */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Spending by Category</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getCategoryColor(index)}`} />
                    <span className="font-medium text-gray-900 capitalize">
                      {category.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      £{category.totalSpent.toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({category.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCategoryColor(index)}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.transactionCount} transactions</span>
                  <span>Avg: £{category.averageAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}