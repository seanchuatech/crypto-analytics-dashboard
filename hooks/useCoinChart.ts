import { useQuery } from '@tanstack/react-query';

const fetchBitcoinChart = async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'
  );
  if (!res.ok) throw new Error('Failed to fetch chart data');
  return res.json();
};

export function useBitcoinChart() {
  return useQuery({ queryKey: ['btc-chart'], queryFn: fetchBitcoinChart });
}
