import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load tasks.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskPayload) => {
    await apiService.createTask(data);
    await fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, data: UpdateTaskPayload) => {
    await apiService.updateTask(id, data);
    await fetchTasks();
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    await apiService.deleteTask(id);
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}
