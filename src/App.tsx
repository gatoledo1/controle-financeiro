import { useState, useEffect } from 'react';
import './App.css';

import TransactionList from './components/TransactionList';
import BalanceSummary from './components/BalanceSummary';
import TransactionForm from './components/Form';
import { ReactChartJS } from './components/ReactApexChart';
import Speedometer from './components/Speedometer';
import { Transactions } from './types/transactions';
import DataPrint from './components/DataPrint';

function App() {
  const localStorageTransactions = localStorage.getItem("transactions")
  const dataTransactions: Array<Transactions> = localStorageTransactions && JSON.parse(localStorageTransactions) || []
  const [transactions, setTransactions] = useState<Array<Transactions>>(dataTransactions);
  const [total, setTotal] = useState('');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [invest, setInvest] = useState(0);

  useEffect(() => {
      const transactionAmounts = transactions.map(({ amount }) => amount);

      const investAmount = transactionAmounts
        .filter((_, index) => transactions[index].IsInvestment)
        .reduce((acc, amount) => acc + amount, 0);

      const notCountAmount = transactionAmounts
        .filter((_, index) => transactions[index].IsNotCount)
        .reduce((acc, amount) => acc + amount, 0);

      const incomeAmount = transactionAmounts
        .filter((amount, index) => !transactions[index].IsInvestment && !transactions[index].IsNotCount && amount > 0)
        .reduce((acc, amount) => acc + amount, 0);

      const expenseAmount = Math.abs(transactionAmounts
        .filter((amount, index) => !transactions[index].IsInvestment && !transactions[index].IsNotCount && amount < 0)
        .reduce((acc, amount) => acc + amount, 0));

      const balance = (incomeAmount - expenseAmount + notCountAmount - investAmount).toFixed(2);

      setTotal(balance);
      setIncome(incomeAmount);
      setExpense(expenseAmount);
      setInvest(investAmount);

      localStorage.setItem("transactions", JSON.stringify(transactions));

  }, [transactions]);

  const addTransaction = (name: string, amount: number, IsInvestment: boolean, IsNotCount: boolean) => {
    const newTransaction = {
      id: generateID(),
      name,
      amount,
      IsInvestment,
      IsNotCount
    };
    setTransactions([...transactions, newTransaction]);
  };

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const generateID = () => Math.round(Math.random() * 10000);

  return (
    <div className="App">
      <h2 style={{textAlign: "center"}}>Controle Financeiro</h2>
      <Speedometer total={total} income={income} expense={expense} invest={invest} transactions={transactions} />
      {
        transactions?.length > 0 && (
          <ReactChartJS total={total} income={income} expense={expense} invest={invest} />
        )
      }
      <TransactionList transactions={transactions} removeTransaction={removeTransaction} />
      <BalanceSummary total={total} income={income} expense={expense} invest={invest} />
      <TransactionForm addTransaction={addTransaction} transactions={transactions} />
      <DataPrint />
    </div>
  );
}

export default App;
