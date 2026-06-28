import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import Loading from '../components/Loading';
import {
  Sparkles, BrainCircuit, RefreshCw, Layers,
  ArrowLeft, ArrowRight, HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudyBuddy() {
  const { flashcards, loading, generateFlashcards, clearFlashcards } = useAI();
  const [notes, setNotes] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = async () => {
    if (notes.trim().length < 20) {
      toast.error('Please paste at least 20 characters of notes.');
      return;
      }
    setFlipped(false);
    setCurrentIndex(0);
    const ok = await generateFlashcards(notes);
    if (ok) toast.success('Flashcards generated! 🧠');
    else toast.error('No flashcards could be parsed. Try pasting more text.');
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((p) => (p + 1) % flashcards.length), 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((p) => (p - 1 + flashcards.length) % flashcards.length), 150);
  };

  const loadExample = () => {
    setNotes('React Hooks Rules and Lifecycle:\n- Only call Hooks at the top level of your React function.\n- Only call Hooks from React Function Components or Custom Hooks.\n- Use state lifting to share common variables among child trees.\n- The virtual DOM recalculates minimal changes before modifying the browser DOM.');
  };

  if (loading) {
    return <Loading type="ai" />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-500" /> AI Study Buddy
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Transform lecture notes into smart flashcards in seconds</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {flashcards.length === 0 ? (
          <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6 space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="text-cyan-600 w-4 h-4" /> Paste Lecture Notes
              </label>
              <button onClick={loadExample} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Load Example</button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your syllabus, slides, or study summaries here (minimum 20 characters)..."
              rows={10}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-sm font-medium transition placeholder-slate-400 leading-relaxed resize-none"
            />

            <button
              onClick={handleGenerate}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md active:scale-95 cursor-pointer flex justify-center items-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Generate Flashcards
            </button>
          </motion.div>
        ) : (
          <motion.div key="cards" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto space-y-6">

            {/* 3D Flashcard Flip */}
            <div className="w-full h-80 cursor-pointer select-none" style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)}>
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute top-4 left-5 text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                    Question
                  </div>
                  <div className="absolute top-4 right-5 text-xs font-bold text-slate-400 dark:text-slate-500">
                    {currentIndex + 1} / {flashcards.length}
                  </div>
                  <div className="space-y-4 px-4">
                    <div className="inline-flex p-2.5 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 rounded-full">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-snug">{flashcards[currentIndex].question}</h3>
                  </div>
                  <div className="absolute bottom-4 text-xs font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Tap to flip
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute top-4 left-5 text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                    Answer
                  </div>
                  <div className="absolute top-4 right-5 text-xs font-bold text-slate-400 dark:text-slate-500">
                    {currentIndex + 1} / {flashcards.length}
                  </div>
                  <div className="space-y-4 px-4">
                    <div className="inline-flex p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm">{flashcards[currentIndex].answer}</p>
                  </div>
                  <div className="absolute bottom-4 text-xs font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Tap to flip
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={handlePrev} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl transition cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => { clearFlashcards(); setNotes(''); }} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl transition">
                <Layers className="w-4 h-4" /> New Set
              </button>
              <button onClick={handleNext} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">All Cards</h4>
              <div className="grid grid-cols-1 gap-3">
                {flashcards.map((card, idx) => (
                  <button key={idx} onClick={() => { setCurrentIndex(idx); setFlipped(false); }} className={`bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border p-4 text-left space-y-1 transition cursor-pointer ${currentIndex === idx ? 'border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Q: {card.question}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">A: {card.answer}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
