import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { FarmerProfile, ChatMessage } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { getClientAgronomistResponse } from '../services/clientAgronomistService.ts';

interface AgronomistChatViewProps {
  farmer: FarmerProfile;
}

export const AgronomistChatView: React.FC<AgronomistChatViewProps> = ({ farmer }) => {
  const { t, language } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text:
        language === 'sw'
          ? `Habari ${farmer.name.split(' ')[0]}! Mimi ni mshauri wako wa kilimo kutoka MkulimaAI.\n\nNimepata taarifa za shamba lako la ekari ${farmer.farmSizeAcres} katika Kaunti ya ${farmer.county} (${farmer.subCounty}), linalolenga zao la ${farmer.currentCrop}.\n\nJe, ninaweza kukusaidia vipi leo kuhusu ratiba za kupanda, kuboresha rutuba ya udongo, au kukabili magonjwa ya mazao?`
          : `Hello ${farmer.name.split(' ')[0]}! I am your MkulimaAI Agronomist advisor.\n\nI have loaded your shamba context for your ${farmer.farmSizeAcres}-acre plot in ${farmer.county} County (${farmer.subCounty}), currently focused on ${farmer.currentCrop}.\n\nHow can I assist you with planting calendars, soil nutrient balancing, or disease mitigation today?`,
      timestamp: new Date().toISOString(),
      isDemo: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedChips =
    language === 'sw'
      ? [
          'Ni mwezi upi mzuri wa kupanda nyanya, mahindi au vitunguu ili kuuza wakati wa bei ya juu zaidi?',
          `Je, ni msimu gani mzuri wa kupanda nyanya Kaunti ya ${farmer.county}?`,
          'Je, nitatambua vipi na kutibu ugonjwa wa ukungu (Early Blight) kwa njia asili?',
          'Je, ni aina gani ya mbegu zilizoidhinishwa zinazofaa udongo wa volcano?',
          'Je, nakokotoaje kiasi cha mbolea kwa ekari 2?',
        ]
      : [
          'What is the best month to plant tomatoes, maize or onions to sell at peak market prices?',
          `What is the best planting calendar for tomatoes in ${farmer.county}?`,
          'How can I identify and control Early Blight naturally?',
          'What certified seed varieties do best in highland volcanic soils?',
          'How do I calculate fertilizer requirements for 2 acres?',
        ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: msgText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('/api/agronomist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          farmContext: farmer,
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.data) {
          const reply = data.data;
          const assistantMsg: ChatMessage = {
            id: reply.id,
            sender: 'assistant',
            text: reply.text,
            timestamp: reply.timestamp,
            isDemo: reply.isDemo,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          return;
        }
      }
      throw new Error('API unavailable or static host rewrite');
    } catch (err) {
      const clientFallback = getClientAgronomistResponse(userMsg.text, farmer, language);
      const assistantMsg: ChatMessage = {
        id: `msg-client-${Date.now()}`,
        sender: 'assistant',
        text: clientFallback.text,
        timestamp: new Date().toISOString(),
        isDemo: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'sw' ? 'Akili Bandia ya Kilimo' : 'Agronomic Intelligence'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {t('agronomistTitle')}
            </h1>
            <p className="text-xs text-slate-500">{t('agronomistSubtitle')}</p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {language === 'sw' ? 'Shamba Linalotumika:' : 'Active Shamba:'}
            </span>
            <span className="font-semibold text-slate-800">
              {farmer.county} • {farmer.farmSizeAcres} {language === 'sw' ? 'Ekari' : 'Ac'} • {farmer.currentCrop}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="rounded-2xl border border-slate-200 bg-white flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`h-6 w-6 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5 ${
                    isUser ? 'bg-slate-900' : 'bg-emerald-600'
                  }`}
                >
                  {isUser ? (language === 'sw' ? 'MIMI' : 'ME') : 'AI'}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'rounded-lg bg-emerald-600 text-white'
                        : 'rounded-lg bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    {m.text}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : ''
                    }`}
                  >
                    <span>
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {m.isDemo && !isUser && (
                      <span className="text-amber-600 font-semibold">
                        • {language === 'sw' ? 'Ushauri wa Mfano' : 'Demo Mode'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%] mr-auto">
              <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                AI
              </div>
              <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-200" />
                <span>
                  {language === 'sw'
                    ? 'Inakagua miongozo ya kilimo ya Kenya...'
                    : 'Consulting Kenya agricultural baseline...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        {suggestedChips.length > 0 && (
          <div className="px-6 py-2.5 bg-slate-50/60 border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />{' '}
              {language === 'sw' ? 'Mapendekezo:' : 'Suggestions:'}
            </span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-xs px-3 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-slate-100 p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
          >
            <input
              id="input-agronomist-chat"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('agronomistInputPlaceholder')}
              className="flex-1 bg-transparent px-2 text-xs outline-none text-slate-800"
            />
            <button
              id="btn-send-agronomist"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-500 transition-colors disabled:opacity-40 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 text-center mt-2">{t('agronomistDisclaimer')}</p>
        </div>
      </div>
    </div>
  );
};
