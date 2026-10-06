import { useEffect, useRef, useState } from 'react';
import type { Route } from '@/lib/router';
import { useToast } from '@/lib/toast';
import { Send, Bot, User as UserIcon, Hospital, CircleDot, Bus, Trees, Dog, Bell, MapPin, PlusCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  cards?: { type: 'hospital' | 'complaint' | 'tourist' | 'rescue' | 'alert'; data: Record<string, string> }[];
  action?: { label: string; route: Route; params?: Record<string, string> };
  suggestions?: string[];
}

const suggestions = [
  'Find nearest hospital',
  'Report a pothole',
  'Find transport',
  'Places to visit',
  'Report injured animal',
  'Show city alerts',
];

function detectIntent(text: string): Message {
  const t = text.toLowerCase();
  const id = crypto.randomUUID();

  if (/(hospital|clinic|medical|doctor|emergency help)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'I found these nearby emergency hospitals in Nagpur. Tap to call or get directions.',
      cards: [
        { type: 'hospital', data: { name: 'AIIMS Nagpur', location: 'Waddhamna', service: '24x7 emergency', phone: '108' } },
        { type: 'hospital', data: { name: 'GMC Hospital', location: 'Medical Square', service: 'Trauma care', phone: '0712-274-6300' } },
        { type: 'hospital', data: { name: 'Orange City Hospital', location: 'Shankar Nagar', service: 'Multi-specialty', phone: '0712-222-2222' } },
      ],
      action: { label: 'Open Emergency Services', route: 'hospitals' },
    };
  }
  if (/(pothole|road|garbage|streetlight|water|drainage|complaint|report issue|report a)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'I can help you report an issue. Tap below to start the complaint workflow — you can add a photo, location, and description.',
      action: { label: 'Report Issue', route: 'report' },
      suggestions: ['Report garbage', 'Report streetlight', 'Report water issue'],
    };
  }
  if (/(transport|bus|metro|route|travel)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'Here are demo transport routes across Nagpur. Tap to view full route details.',
      action: { label: 'Open Transport', route: 'transport' },
      cards: [
        { type: 'complaint', data: { name: 'Metro Orange Line', detail: 'Automotive Square to Khapri · 34 min' } },
        { type: 'complaint', data: { name: 'Bus 51', detail: 'Railway Station to Airport · 26 min' } },
      ],
    };
  }
  if (/(tourist|visit|explore|place|sightsee|lake|park|heritage)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'Here are some popular destinations to explore in Nagpur.',
      cards: [
        { type: 'tourist', data: { name: 'Deekshabhoomi', location: 'Sitabuldi', description: 'Sacred Buddhist monument' } },
        { type: 'tourist', data: { name: 'Futala Lake', location: 'Futala', description: 'Lake with food stalls and fountain show' } },
        { type: 'tourist', data: { name: 'Japanese Garden', location: 'Sonegaon', description: 'Tranquil Japanese-style garden' } },
      ],
      action: { label: 'Explore Nagpur', route: 'explore' },
    };
  }
  if (/(animal|dog|cat|bird|injured|rescue)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'I can help you report an injured animal. Tap below to start the rescue report — you can add a photo, location, and condition.',
      action: { label: 'Report Injured Animal', route: 'rescue' },
    };
  }
  if (/(alert|notice|warning|weather|traffic alert)/.test(t)) {
    return {
      id, role: 'assistant',
      text: 'Here are the latest city alerts for Nagpur.',
      cards: [
        { type: 'alert', data: { title: 'Thunderstorm warning', area: 'Nagpur city', priority: 'High' } },
        { type: 'alert', data: { title: 'Metro construction on Wardha Road', area: 'Wardha Road', priority: 'Medium' } },
      ],
      action: { label: 'Open City Alerts', route: 'alerts' },
    };
  }
  return {
    id, role: 'assistant',
    text: "I'm your AI Saathi. I can help you report issues, find hospitals, check transport, explore Nagpur, report injured animals, and see city alerts. What would you like to do?",
    suggestions,
  };
}

export function AiPage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const { show } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        role: 'assistant',
        text: "Namaste! I'm AI Saathi, your smart city assistant. How can I help you today?",
        suggestions,
      }]);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const reply = detectIntent(text);
      setMessages(m => [...m, reply]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-2xl flex-col lg:h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white"><Bot size={20} /></div>
        <div>
          <h1 className="text-lg font-bold text-navy-900">AI Saathi</h1>
          <p className="text-xs text-navy-400">Your smart city assistant · Demo mode</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-white p-4 shadow-card ring-1 ring-navy-50 no-scrollbar">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-saffron-100 text-saffron-700' : 'bg-navy-900 text-white'}`}>
              {m.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-900'}`}>
                {m.text}
              </div>

              {m.cards?.map((card, idx) => (
                <div key={idx} className="mt-2 rounded-2xl border border-navy-100 bg-white p-3 text-left shadow-card">
                  {card.type === 'hospital' && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Hospital size={16} className="text-rose-500" />
                        <p className="text-sm font-bold text-navy-900">{card.data.name}</p>
                      </div>
                      <p className="mt-1 text-xs text-navy-500">{card.data.location} · {card.data.service}</p>
                      <div className="mt-2 flex gap-2">
                        <a href={`tel:${card.data.phone}`} className="btn-ghost px-3 py-1.5 text-xs">Call {card.data.phone}</a>
                        <button onClick={() => navigate('hospitals')} className="btn-ghost px-3 py-1.5 text-xs">Directions</button>
                      </div>
                    </div>
                  )}
                  {card.type === 'tourist' && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Trees size={16} className="text-emerald-500" />
                        <p className="text-sm font-bold text-navy-900">{card.data.name}</p>
                      </div>
                      <p className="mt-1 text-xs text-navy-500"><MapPin size={11} className="inline" /> {card.data.location}</p>
                      <p className="mt-1 text-xs text-navy-600">{card.data.description}</p>
                      <button onClick={() => navigate('explore')} className="btn-ghost mt-2 px-3 py-1.5 text-xs">Explore</button>
                    </div>
                  )}
                  {card.type === 'complaint' && (
                    <div>
                      <p className="text-sm font-bold text-navy-900">{card.data.name}</p>
                      <p className="mt-1 text-xs text-navy-500">{card.data.detail}</p>
                    </div>
                  )}
                  {card.type === 'alert' && (
                    <div>
                      <p className="text-sm font-bold text-navy-900">{card.data.title}</p>
                      <p className="mt-1 text-xs text-navy-500">{card.data.area} · {card.data.priority}</p>
                    </div>
                  )}
                </div>
              ))}

              {m.action && (
                <button onClick={() => navigate(m.action!.route, m.action!.params)} className="btn-primary mt-2 px-3 py-1.5 text-xs">
                  {m.action.label}
                </button>
              )}

              {m.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.suggestions.map(s => (
                    <button key={s} onClick={() => send(s)} className="rounded-full bg-navy-50 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-100">{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white"><Bot size={16} /></div>
            <div className="flex items-center gap-1 rounded-2xl bg-navy-50 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={e => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-card ring-1 ring-navy-100"
      >
        <input
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-navy-300"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI Saathi anything..."
        />
        <button type="submit" className="btn-primary px-3 py-2" aria-label="Send">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
