import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Calendar, FileText, Send, HelpCircle, Loader2, CheckCircle, Copy } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { ErrorState } from '../components/Loading';
import toast from 'react-hot-toast';

export default function NoticeSummarizer() {
  const { loading, error, summarizeNotice } = useAI();
  const [notice, setNotice] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    if (!notice.trim()) { toast.error('Please paste a notice first!'); return; }
    try {
      const result = await summarizeNotice(notice, eventDate);
      if (result.summary) {
        setSummary(result.summary);
        toast.success('Notice summarized and broadcasted! 📣');
      } else {
        toast.error('No summary returned from the server.');
      }
    } catch { /* error shown via hook */ }
  };

  const loadExample = () => {
    setNotice(
      `IMPORTANT COLLEGE CIRCULAR: CSE DEPARTMENT SEMESTER LAB EXAM REGISTRATION\n\nAll 3rd Year CSE students are hereby informed that registration for the upcoming Database Systems & Artificial Intelligence Laboratory examinations will close on Tuesday. Eligible students must log into their Academic ERP, fill out the form, pay the exam fee of $15, and submit their course portfolio details to their respective lab instructors. Late applications will not be processed. The exam schedules will start from next week. Please carry your physical ID card to the exam venue.`
    );
    setEventDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-violet-500" />
          Notice Summarizer
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Distill long college circulars into clear, actionable summaries and broadcast them instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Input Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <FileText className="text-violet-500 w-4 h-4" />
              Notice Text
            </h3>
            <button onClick={loadExample} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition">
              Load Example
            </button>
          </div>

          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="Paste raw college notice, email, or department circular here…"
            rows={9}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium transition placeholder-slate-400 leading-relaxed resize-none"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Associated Event Date (Optional)
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium transition cursor-pointer"
            />
          </div>

          {error && <ErrorState title="Summarization Failed" message={error} />}

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md shadow-violet-600/30 active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing Notice…</>
            ) : (
              <><Send className="w-4 h-4" /> Summarize & Broadcast</>
            )}
          </button>
        </motion.div>

        {/* ── Output Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Megaphone className="text-slate-400 w-4 h-4" />
              Broadcast Output
            </h3>
            {summary && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {!summary ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 space-y-4"
                >
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full">
                    <HelpCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No summary yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-xs">
                      Paste a notice on the left and click Summarize & Broadcast to see the output here.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line overflow-y-auto">
                    {summary}
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      <CheckCircle className="w-3.5 h-3.5" />
                      Broadcasted to student channels
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
