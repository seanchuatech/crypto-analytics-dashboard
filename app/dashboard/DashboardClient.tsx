'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { unparse } from 'papaparse';
import PDFExportButton from '@/components/pdf/PDFExportButton';
import { ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

const coins = ['bitcoin', 'ethereum', 'solana', 'dogecoin'];
const ranges = ['1', '7', '30'];
const coinOptions = coins.map((coin) => ({ value: coin, label: coin.toUpperCase() }));

export default function DashboardClient({ session }: { session: any }) {
  const [selectedCoins, setSelectedCoins] = useState([{ value: 'bitcoin', label: 'BITCOIN' }]);
  const [selectedRange, setSelectedRange] = useState('7');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coinSummary, setCoinSummary] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchChartData = async (coins: string[], days: string) => {
    setLoading(true);
    const datasets = await Promise.all(
      coins.map(async (coin) => {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`
        );
        const data = await res.json();
        const prices = data.prices || [];
        const firstPrice = prices[0][1];
        const lastPrice = prices[prices.length - 1][1];
        const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

        return {
          chart: {
            label: `${coin.toUpperCase()} % Change`,
            data: prices.map((p: number[]) => ({
              x: new Date(p[0]),
              y: ((p[1] - firstPrice) / firstPrice) * 100,
            })),
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            borderColor:
              coin === 'bitcoin'
                ? 'rgb(59,130,246)'
                : coin === 'ethereum'
                ? 'rgb(34,197,94)'
                : coin === 'solana'
                ? 'rgb(234,179,8)'
                : 'rgb(244,63,94)',
          },
          summary: {
            coin,
            firstPrice,
            lastPrice,
            percentChange,
          },
        };
      })
    );

    setChartData({ datasets: datasets.map((d) => d.chart) });
    setCoinSummary(datasets.map((d) => d.summary));
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCoins && selectedCoins.length > 0) {
      fetchChartData(
        selectedCoins.map((c) => c.value),
        selectedRange
      );
    } else {
      setChartData(null);
      setCoinSummary([]);
    }
  }, [selectedCoins, selectedRange]);

  const handleCSVExport = () => {
    if (!chartData) return;
    const exportData = chartData.datasets.flatMap((ds: any) =>
      ds.data.map((point: any) => ({
        coin: ds.label,
        date: format(new Date(point.x), 'PPpp'),
        percentChange: `${point.y.toFixed(2)}%`,
      }))
    );

    const csv = unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `multi_coin_percent_${selectedRange}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pdfData =
    chartData?.datasets.flatMap((ds: any) =>
      ds.data.map((point: any) => ({
        coin: ds.label,
        date: format(new Date(point.x), 'PPpp'),
        percentChange: `${point.y.toFixed(2)}%`,
      }))
    ) || [];

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📊 Crypto Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {session.user?.name}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-2/3">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Select Coins</label>
            {mounted && (
              <Select
                isMulti
                options={coinOptions}
                value={selectedCoins}
                onChange={(selected) => setSelectedCoins(selected as any)}
                className="text-sm"
              />
            )}
          </div>

          <div className="relative w-full sm:w-1/3">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Time Range</label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm text-sm focus:outline-none focus:ring"
            >
              {ranges.map((r) => (
                <option key={r} value={r}>
                  Last {r}d
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 absolute right-3 top-10 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coinSummary.map((coin) => (
            <div key={coin.coin} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">{coin.coin}</h3>
              <p className="text-sm text-gray-700">Start: ${coin.firstPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-700">End: ${coin.lastPrice.toFixed(2)}</p>
              <p
                className={`text-sm font-medium mt-1 ${
                  coin.percentChange > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {coin.percentChange > 0 ? '+' : ''}
                {coin.percentChange.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-2">
          {mounted && selectedCoins.length > 0 && (
            <>
              <PDFExportButton
                data={pdfData}
                filename={`multi_coin_percent_${selectedRange}d.pdf`}
              />
              <button
                onClick={handleCSVExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export CSV
              </button>
            </>
          )}
        </div>

        <div className="bg-gray-100 rounded-xl p-4">
          {loading || !chartData || !mounted ? (
            <p className="text-gray-500">Loading chart...</p>
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      title: (ctx) =>
                        format(new Date(ctx[0].parsed.x), 'PPpp'),
                      label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`,
                    },
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'day',
                      tooltipFormat: 'PPpp',
                    },
                  },
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: '% Change',
                    },
                    ticks: {
                      callback: (value) => `${value.toFixed(2)}%`,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
