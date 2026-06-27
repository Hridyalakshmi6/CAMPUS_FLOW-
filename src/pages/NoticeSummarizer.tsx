import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Megaphone, Calendar, FileText, Send, HelpCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NoticeSummarizer() {
  const [notice, setNotice] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    if (!notice.trim()) {
      toast.error('Please paste a college notice first!');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.summarizeNotice(notice, eventDate);
      if (data.summary) {
        setSummary(data.summary);
        toast.success('Notice summarized and broadcasted successfully!');
      } else {
        toast.error('Could not summarize the notice. Please check the text.');
      }
    } catch (err: any) {
      toast.error('Error summarizing notice.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setNotice(
      "IMPORTANT COLLEGE CIRCULAR: CSE DEPARTMENT SEMESTER LAB EXAM REGISTRATION\n\nAll 3rd Year CSE students are hereby informed that registration for the upcoming Database Systems & Artificial Intelligence Laboratory examinations will close on Tuesday. Eligible students must log into their Academic ERP, fill out the form, pay the exam fee of $15, and submit their course portfolio details to their respective lab instructors. Late applications will not be processed under any circumstances. The exam schedules will start from next week. Please carry your physical ID card to the exam venue."
    );
    setEventDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 5 days from now
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-violet-500 fill-violet-100" />
          Notice Summarizer & Broadcast
        </h2>
        <p className="text-sm font-medium text-slate-500">Paste long official college PDFs, notices, or group chat circulars to distill key instructions and event timelines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <FileText className="text-violet-500 w-4 h-4" />
              Notice Circular
            </h3>
            <button
              onClick={loadExample}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Load Example Notice
            </button>
          </div>

          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="Paste raw college notice announcements, emails, or department notifications here..."
            rows={10}
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium transition placeholder-slate-400 leading-relaxed"
          />

          {/* Event Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Associated Event Date (Optional)
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-sm font-medium transition cursor-pointer"
            />
          </div>

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md active:scale-98 cursor-pointer flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Synthesizing Summary & Scheduling Broadcast...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Summarize & Broadcast
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 mb-4">
              <Megaphone className="text-slate-400 w-4 h-4" />
              Broadcast Summary Output
            </h3>

            {!summary ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                  <HelpCircle className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">No summary generated yet</p>
                  <p className="text-xs text-slate-400 font-medium max-w-xs">Paste your notice in the panel on the left and click Summarize & Broadcast to view the simplified timeline and actions.</p>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none text-slate-700 space-y-4 leading-relaxed text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-line font-medium">
                {summary}
              </div>
            )}
          </div>

          {summary && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-3xs font-semibold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              Successfully Broadcasted to Group Channels & Student Feeds
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
