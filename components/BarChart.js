import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for a Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, onBarClick }) => {
  // Format the dates to 'dd/mm/yyyy' before using them as labels
  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-GB')
  }));

  const chartData = {
    labels: formattedData.map(d => d.date), // Use formatted dates as labels
    datasets: [
      {
        label: 'Stock Value (£)',
        data: formattedData.map(d => d.value),
        backgroundColor: 'rgba(227, 72, 72, 0.5)',
        borderColor: 'rgb(227, 72, 72)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fit the container size
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onBarClick) {
        const elementIndex = elements[0].index;
        onBarClick(elementIndex); // Call the onBarClick function passed as a prop
      }
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '650px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
