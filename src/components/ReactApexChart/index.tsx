import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Data } from '../../types/data';

ChartJS.register(ArcElement, Tooltip, Legend);

export function ReactChartJS({expense, invest, income}: Data) {
  const data = {
    labels: ["Receitas", "Despesas", "Investimentos"],
    datasets: [
      {
        label: 'Valor: ',
        data: [income, expense, Math.abs(invest)],
        backgroundColor: [
          // 'rgb(159, 88, 246, 0.3)',
          'rgba(0, 255, 34, 0.3)',
          'rgba(248, 37, 15, 0.3)',
          'rgba(0, 138, 255, 0.3)',
        ],
        borderColor: ["#04db5f", "#e74c3c", "#008aff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
      <h3>Gráfico do saldo</h3>
      <Doughnut data={data} />
    </div>
  );
}