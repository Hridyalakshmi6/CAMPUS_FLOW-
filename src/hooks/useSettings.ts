import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

function applyTheme(darkMode: Settings['darkMode']) {
  const root = document.documentElement;
  if (darkMode === 'dark') {
    root.classList.add('dark');
  } else if (darkMode === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    const token = localStorage.getItem('campusflow_token');
    if (!token) {
      try {
        const saved = localStorage.getItem('campusflow_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
          applyTheme(parsed.darkMode);
        }
      } catch {
        // default remains
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSettings();
      setSettings(data);
      applyTheme(data.darkMode);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load settings.';
      setError(msg);
      // Fallback to local
      try {
        const saved = localStorage.getItem('campusflow_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
          applyTheme(parsed.darkMode);
        }
      } catch {
        // default remains
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<Settings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    applyTheme(updated.darkMode);
    
    // Always persist locally
    localStorage.setItem('campusflow_settings', JSON.stringify(updated));

    // Persist to server if logged in
    const token = localStorage.getItem('campusflow_token');
    if (token) {
      try {
        await apiService.updateSettings(updates);
      } catch (err) {
        console.error('Failed to update backend settings:', err);
      }
    }
  };

  return { settings, loading, error, updateSettings, refresh: fetchSettings };
}
