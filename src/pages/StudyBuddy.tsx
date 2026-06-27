import React, { useState } from 'react';
import { apiService } from '../services/api';
import Loading from '../components/Loading';
import { Sparkles, BrainCircuit, RefreshCw, Layers, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Flashcard {
  question: string;
  answer: string;
}

export default function StudyBuddy() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      toast.error('Please paste some lecture notes first!');
      return;
    }

    setLoading(true);
    setFlipped(false);
    setCurrentIndex(0);
    try {
      const data = await apiService.generateFlashcards(notes);
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        toast.success('Successfully generated flashcards with AI!');
      } else {
        toast.error('No flashcards could be parsed. Try pasting more text.');
      }
    } catch (err: any) {
      toast.error('Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const loadExample = () => {
    setNotes(
      "React Hooks Rules and Lifecycle:\n- Only call Hooks at the top level of your React function. Don't call them inside loops, conditions, or nested functions.\n- Only call Hooks from React Function Components or Custom Hooks.\n- Use state lifting to share common variables among child trees.\n- The virtual DOM recalculates minimal changes before modifying the native browser DOM node."
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-500 fill-cyan-100" />
          AI Study Buddy
        </h2>
        <p className="text-sm font-medium text-slate-500">Transform raw lecture notes, text files, or study material into custom flashcards in seconds</p>
      </div>

      {flashcards.length === 0 ? (
        /* Input Screen */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="text-cyan-600 w-4 h-4" />
              Paste Lecture Notes
            </label>
            <button
              onClick={loadExample}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Load Example Notes
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your syllabus details, slides, summaries, or meeting transcripts here (minimum 20 characters)..."
            rows={10}
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-sm font-medium transition placeholder-slate-400 leading-relaxed"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md active:scale-98 cursor-pointer flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Synthesizing Flashcards with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      ) : (
        /* Flashcards Display Card */
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Card Container */}
          <div 
            onClick={() => setFlipped(!flipped)}
            className="h-80 w-full bg-white rounded-3xl shadow-md border border-slate-100 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden select-none hover:shadow-lg active:scale-99"
          >
            {/* Corner Decorative indicators */}
            <div className="absolute top-4 left-6 text-3xs font-black uppercase tracking-widest text-slate-300">
              {flipped ? 'Answer card' : 'Question card'}
            </div>
            <div className="absolute top-4 right-6 text-3xs font-bold text-slate-400">
              Card {currentIndex + 1} of {flashcards.length}
            </div>

            {/* Flashcard Body */}
            <div className="px-4 py-6 flex flex-col items-center justify-center min-h-[160px] w-full">
              {!flipped ? (
                <div className="space-y-4">
                  <div className="inline-flex p-2 bg-cyan-50 text-cyan-600 rounded-full mb-1">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
                    {flashcards[currentIndex].question}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-full mb-1">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-sm">
                    {flashcards[currentIndex].answer}
                  </p>
                </div>
              )}
            </div>

            {/* Tap indicator */}
            <div className="absolute bottom-4 text-3xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-slate-300" />
              Tap card to flip and review
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              title="Previous Card"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setFlashcards([])}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              <Layers className="w-4 h-4" />
              New Set
            </button>

            <button
              onClick={handleNext}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
              title="Next Card"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Grid View of all flashcards for summary review */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Flashcard Overview</h4>
            <div className="grid grid-cols-1 gap-3">
              {flashcards.map((card, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-2">
                  <p className="text-xs font-bold text-slate-800">Q: {card.question}</p>
                  <p className="text-xs text-slate-500 font-medium">A: {card.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-3xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-cyan-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-600">AI is analyzing your lecture notes...</p>
          </div>
        </div>
      )}

    </div>
  );
}
