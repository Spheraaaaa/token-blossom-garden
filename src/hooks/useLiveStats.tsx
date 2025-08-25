import { useState, useEffect } from 'react';

interface LiveStats {
  totalNFTs: number;
  totalSales: number;
  latestDropTime: string;
}

export const useLiveStats = () => {
  const [stats, setStats] = useState<LiveStats>({
    totalNFTs: 1116891,
    totalSales: 331951,
    latestDropTime: '~2m ago'
  });

  const [animatingStats, setAnimatingStats] = useState<{[key: string]: boolean}>({
    totalNFTs: false,
    totalSales: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Рандомно выбираем какую статистику обновить
      const shouldUpdateNFTs = Math.random() > 0.7;
      const shouldUpdateSales = Math.random() > 0.6;

      if (shouldUpdateNFTs) {
        const increment = Math.floor(Math.random() * 10) + 1;
        setAnimatingStats(prev => ({ ...prev, totalNFTs: true }));
        setStats(prev => ({ 
          ...prev, 
          totalNFTs: prev.totalNFTs + increment 
        }));
        setTimeout(() => {
          setAnimatingStats(prev => ({ ...prev, totalNFTs: false }));
        }, 800);
      }

      if (shouldUpdateSales) {
        const increment = Math.floor(Math.random() * 10) + 1;
        setAnimatingStats(prev => ({ ...prev, totalSales: true }));
        setStats(prev => ({ 
          ...prev, 
          totalSales: prev.totalSales + increment 
        }));
        setTimeout(() => {
          setAnimatingStats(prev => ({ ...prev, totalSales: false }));
        }, 800);
      }

      // Обновляем время последнего дропа
      const timeOptions = ['~1m ago', '~2m ago', '~3m ago', '~30s ago', '~45s ago'];
      const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
      setStats(prev => ({ 
        ...prev, 
        latestDropTime: randomTime 
      }));

    }, 3000 + Math.random() * 4000); // Интервал от 3 до 7 секунд

    return () => clearInterval(interval);
  }, []);

  return { stats, animatingStats };
};