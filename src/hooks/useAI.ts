import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Flashcard, NoticeSummary } from '../types';

interface UseAIReturn {
  flashcards: Flashcard[];
  noticeSummary: string;
  loading: boolean;
  error: string | null;
  generateFlashcards: (notes: string) => Promise<boolean>;
  summarizeNotice: (notice: string, eventDate: string) => Promise<boolean>;
  clearFlashcards: () => void;
  clearSummary: () => void;
}

export function useAI(): UseAIReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [noticeSummary, setNoticeSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlashcards = useCallback(async (notes: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.generateFlashcards(notes);
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        return true;
      }
      setError('No flashcards could be parsed. Try pasting more content.');
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate flashcards.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const summarizeNotice = useCallback(async (notice: string, eventDate: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data: NoticeSummary = await apiService.summarizeNotice(notice, eventDate);
      if (data.summary) {
        setNoticeSummary(data.summary);
        return true;
      }
      setError('Failed to summarize notice.');
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to summarize notice.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFlashcards = useCallback(() => {
    setFlashcards([]);
    setError(null);
  }, []);

  const clearSummary = useCallback(() => {
    setNoticeSummary('');
    setError(null);
  }, []);

  return {
    flashcards,
    noticeSummary,
    loading,
    error,
    generateFlashcards,
    summarizeNotice,
    clearFlashcards,
    clearSummary,
  };
}
