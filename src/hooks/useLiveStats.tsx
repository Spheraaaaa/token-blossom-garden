import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  // Load initial stats from database
  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_marketplace_stats');
      if (data && !error) {
        const statsData = data as any; // Type assertion for RPC response
        setStats({
          totalNFTs: Number(statsData.total_nfts),
          totalSales: Number(statsData.total_sales),
          latestDropTime: String(statsData.latest_drop_time)
        });
      }
    } catch (err) {
      console.error('Error loading marketplace stats:', err);
    }
  };

  // Update stats on server
  const updateStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('update-marketplace-stats');
      if (data?.data && !error) {
        // Animate the increments
        if (data.data.nft_increment > 0) {
          setAnimatingStats(prev => ({ ...prev, totalNFTs: true }));
          setTimeout(() => {
            setAnimatingStats(prev => ({ ...prev, totalNFTs: false }));
          }, 800);
        }
        
        if (data.data.sales_increment > 0) {
          setAnimatingStats(prev => ({ ...prev, totalSales: true }));
          setTimeout(() => {
            setAnimatingStats(prev => ({ ...prev, totalSales: false }));
          }, 800);
        }

        // Reload stats from database to get updated values
        await loadStats();
      }
    } catch (err) {
      console.error('Error updating marketplace stats:', err);
    }
  };

  useEffect(() => {
    // Load initial stats
    loadStats();

    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('marketplace-stats-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'marketplace_stats'
        },
        (payload) => {
          console.log('Real-time stats update:', payload);
          if (payload.new) {
            const newData = payload.new as any; // Type assertion for realtime payload
            setStats({
              totalNFTs: Number(newData.total_nfts),
              totalSales: Number(newData.total_sales),
              latestDropTime: String(newData.latest_drop_time)
            });
          }
        }
      )
      .subscribe();

    // Set up interval to update stats every 5-8 seconds
    const interval = setInterval(() => {
      updateStats();
    }, 5000 + Math.random() * 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, animatingStats };
};