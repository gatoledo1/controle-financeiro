import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Transactions } from '../../types/transactions';

interface Form {
  addTransaction: (name: string, amount: number, IsInvestment: boolean, IsNotCount: boolean) => void, 
  transactions: Array<Transactions>
}

function TransactionForm({ addTransaction, transactions }: Form) {
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState<string | undefined>('');
  const [isInvestment, setIsInvestment] = useState(false);
  const [isNotCount, setIsNotCount] = useState(false);
  const [balanceType, setBalanceType] = useState("");

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!transactionName || !transactionAmount || (!balanceType && !isNotCount)) {
      alert('Por favor, preencha os dados da transação!');
      return;
    }

    if(isInvestment && transactions?.length == 0) {
      alert('Adicione receita antes de adicionar investimento!');
      return;
    }

    if((balanceType == "-") && transactions?.length == 0) {
      alert('Adicione pelo menos um saldo positivo para começar!');
      return;
    }

    addTransaction(
      transactionName,
      parseFloat(balanceType + transactionAmount.replace(",", ".")),
      isInvestment,
      isNotCount
    );

    setBalanceType("")
    setTransactionName('');
    setTransactionAmount('');
    setIsInvestment(false);
    setIsNotCount(false);
  };

  return (
    <div className="container form">
      <h3 style={{ margin: '50px 0 20px' }}>Adicionar transação</h3>
      <form onSubmit={handleFormSubmit}>
        <p>Selecione o tipo:</p>
        <div style={{display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 16}}>
          <a onClick={() => setBalanceType("-")} className={balanceType == "-" ? "balance-btn btn-active minus" : "balance-btn"}>Despesa</a>
          <a onClick={() => setBalanceType("+")} className={balanceType == "+" ? "balance-btn btn-active plus" : "balance-btn"}>Receita</a>
          <a onClick={() => setIsNotCount(!isNotCount)} className={isNotCount ? "balance-btn btn-active justTotal" : "balance-btn"}>Apenas no saldo</a>
        </div>
        <div className="form-control">
          <input
            autoFocus
            className="input-effect"
            type="text"
            id="text"
            autoComplete="off"
            placeholder="Nome da transação"
            value={transactionName}
            onChange={(e) => setTransactionName(e.target.value)}
          />
        </div>
        <div className="margin-bottom-2">
          <div className="form-control">
            <CurrencyInput
              className="input-effect"
              placeholder="R$ 0,00"
              defaultValue={0}
              decimalsLimit={2}
              groupSeparator="."
              decimalSeparator=","
              prefix="R$ "
              disableAbbreviations={true}
              allowNegativeValue={false}
              value={transactionAmount}
              onValueChange={(value) => setTransactionAmount(value)}
            />
          </div>
        </div>

        <div className="form-control">
          <input
            type="checkbox"
            id="isInvestment"
            value="isInvestment"
            style={{ transform: 'scale(1.5)' }}
            checked={isInvestment}
            onChange={() => setIsInvestment(!isInvestment)}
          />
          <label
            htmlFor="isInvestment"
            style={{
              fontSize: '1rem',
              color: 'var(--h2)',
              margin: '0 1rem 1rem',
              display: 'inline-block',
            }}
          >
            Poupança / investimento?
          </label>

          <small>* Para adicionar, utilize Receita. Para remover, Despesa</small>
          <small>** A poupança é diretamente ligada pelo saldo</small>
        </div>

        <button type="submit" className="btn">Adicionar</button>
      </form>
    </div>
  );
}

export default TransactionForm;
