import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { DashboardData, Task } from '../types';

interface UseDashboardReturn {
  dashboardData: DashboardData | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, allTasks] = await Promise.all([
        apiService.getDashboard(),
        apiService.getTasks(),
      ]);
      setDashboardData(stats);
      setTasks(allTasks);
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : 'Failed to load dashboard. Please ensure the backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dashboardData, tasks, loading, error, refresh };
}
