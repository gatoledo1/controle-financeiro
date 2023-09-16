import { Transactions } from "../../types/transactions";

interface List {
  removeTransaction: (id: number) => void, 
  transactions: Array<Transactions>
}

function TransactionList({ transactions, removeTransaction }: List) {
  const clearListTransaction = () => {
    const confirmAction = confirm("Quer mesmo excluir tudo?");
    if (confirmAction) {
      localStorage.removeItem('transactions');
      location.reload()
    }
  }

  return (
    <div className="container">
      <h3>Lista de transações</h3>
      <ul id="transactions" className="transactions">
        {
          transactions?.length > 0 ? 
            transactions.map((transaction) => {
              let typeOperation
              if (transaction.IsInvestment == true) typeOperation = "invest"
              if (transaction.IsNotCount == true) typeOperation = "justTotal"
              if (transaction.amount > 0 && !transaction.IsInvestment && !transaction.IsNotCount) typeOperation = "plus"
              if (transaction.amount < 0 && !transaction.IsInvestment && !transaction.IsNotCount) typeOperation = "minus"

              return (    
              <li key={transaction.id} className={typeOperation}>
                {transaction.name}{' '}
                <span>
                  {transaction.amount < 0 ? '-' : '+'} R${' '}
                  {String(Math.abs(transaction.amount)).replace(".", ",")}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeTransaction(transaction.id)}
                >
                  x
                </button>
              </li>
            )})
          :
            (
              <p>Nenhuma transação até o momento</p>
            )
        }
      </ul>
      {
        transactions?.length > 0 && (
          <a className="btn" onClick={() => clearListTransaction()}
            style={{backgroundColor: "rgba(67, 67, 67, 0.1)", color: "#878c94", marginBottom: 30}}
          >
            Limpar tudo
          </a>
        )
      }
    </div>
  );
}

export default TransactionList;