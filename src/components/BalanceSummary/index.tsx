interface Balance {
  total: string, income: number, expense: number, invest: number
}

function BalanceSummary({ total, income, expense, invest} : Balance) {
  return (
    <div className="inc-exp-container">
      <div>
        <h4>Poupança / Investimentos</h4>
        <p id="invest" className="money invest">
          + R${' '}
          {invest?.toFixed(2).replace(".", ",") || 0}
        </p>
      </div>
      <div>
        <h4>Receitas</h4>
        <p id="money-plus" className="money plus">
          + R${' '}
          {income?.toFixed(2).replace(".", ",") || 0}
        </p>
      </div>
      <div>
        <h4>Despesas</h4>
        <p id="money-minus" className="money minus">
          - R${' '}
          {expense?.toFixed(2).replace(".", ",") || 0}
        </p>
      </div>
      <div>
        <h4>Saldo atual</h4>
        <p id="balance" className="money balance">
          R$ {String(total).replace(".", ",")}
        </p>
      </div>
    </div>
  );
}

export default BalanceSummary;
