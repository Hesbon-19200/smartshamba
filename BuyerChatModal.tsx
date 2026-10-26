import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Phone,
  MessageCircle,
  Sparkles,
  Check,
  CheckCheck,
  Building2,
  Lock,
  Volume2,
  FileText,
  Clock,
  ThumbsUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { FarmerProfile, LocalBuyerContact } from '../types/index.ts';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { VoiceInputButton } from './VoiceInputButton.tsx';

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'buyer';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  isOfferProposal?: boolean;
  offerDetails?: {
    crop: string;
    quantity: string;
    priceKes: number;
    paymentTerm: string;
    pickupLocation: string;
    status: 'pending' | 'accepted' | 'negotiating';
  };
}

interface BuyerChatModalProps {
  buyer: LocalBuyerContact;
  farmer: FarmerProfile;
  language: 'sw' | 'en';
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const BuyerChatModal: React.FC<BuyerChatModalProps> = ({
  buyer,
  farmer,
  language,
  onClose,
  showToast,
}) => {
  const { speakText } = useAccessibility();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storageKey = `mkulima_buyer_chat_${buyer.id}`;

  // Initial greeting tailored to buyer's verified category and purchases
  const defaultInitialMessages: ChatMessage[] = [
    {
      id: `msg-buyer-init-${buyer.id}`,
      sender: 'buyer',
      text:
        language === 'sw'
          ? `Habari Mkulima! Mimi ni ${buyer.contactPerson} kutoka ${buyer.businessName}. Tunanunua ${buyer.cropsPurchased.slice(0, 3).join(', ')} kwa wingi kwa malipo ya ${buyer.paymentTerms}. Una kiasi gani cha mazao tayari shambani kwako kwa sasa?`
          : `Hello Farmer! I am ${buyer.contactPerson} with ${buyer.businessName}. We actively procure ${buyer.cropsPurchased.slice(0, 3).join(', ')} with ${buyer.paymentTerms}. What harvest volume do you have ready on your farm?`,
      timestamp: 'Saa 3 zilizopita',
      status: 'read',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultInitialMessages;
  });

  const [inputText, setInputText] = useState('');
  const [isBuyerTyping, setIsBuyerTyping] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  // Proposal Form State
  const [proposalData, setProposalData] = useState({
    crop: buyer.cropsPurchased[0] || farmer.currentCrop || 'Tomatoes',
    quantity: '30 Crates (64kg)',
    priceKes: 3850,
    paymentTerm: buyer.paymentTerms,
    pickupLocation: `${farmer.county}, ${farmer.subCounty || 'Shambani'}`,
  });

  // Save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages, storageKey]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBuyerTyping]);

  // Quick negotiation chips
  const quickChips = [
    {
      sw: `📦 Nina ${buyer.cropsPurchased[0] || 'mazao'} tayari kuvunwa shambani`,
      en: `📦 I have ${buyer.cropsPurchased[0] || 'produce'} ready to harvest`,
    },
    {
      sw: `💰 Bei yangu ya chini ni KSh 3,850 kwa kipimo`,
      en: `💰 My farm-gate asking rate is KSh 3,850 / unit`,
    },
    {
      sw: `🚚 Je, mnaleta usafiri kuchukua shambani?`,
      en: `🚚 Do you provide truck collection from the farm?`,
    },
    {
      sw: `📍 Shamba liko karibu na barabara kuu ya lami`,
      en: `📍 The farm is right near the tarmac road`,
    },
    {
      sw: `🤝 Tufunge makubaliano ya malipo kwa M-PESA`,
      en: `🤝 Let us agree on instant M-PESA payment`,
    },
  ];

  // Automated intelligent buyer replies based on conversation context
  const triggerBuyerResponse = (userText: string) => {
    setIsBuyerTyping(true);

    setTimeout(() => {
      setIsBuyerTyping(false);
      const lower = userText.toLowerCase();

      let replyText = '';
      if (lower.includes('bei') || lower.includes('price') || lower.includes('ksh') || lower.includes('cost')) {
        replyText =
          language === 'sw'
            ? `Bei hiyo ya KSh inaingiliana vizuri na bajeti yetu ya wiki hii. Je, unaweza kututumia picha ya ubora wa mazao, na tarehe unayoweza kuruhusu lori letu kufika kupakia?`
            : `That KES rate aligns well with our procurement budget this week. Could you confirm the exact grade quality and the day our pickup truck can arrive at your farm?`;
      } else if (lower.includes('usafiri') || lower.includes('lori') || lower.includes('transport') || lower.includes('truck')) {
        replyText =
          language === 'sw'
            ? `Ndiyo, kwa oda kubwa ya kuanzia kiwango cha ${buyer.minimumVolume}, tunatuma lori letu moja kwa moja shambani kwako. Madereva wetu wamezoea maeneo ya ${buyer.county}.`
            : `Yes, for batches meeting our minimum volume of ${buyer.minimumVolume}, we deploy our own off-take truck directly to your farm gate in ${buyer.county}.`;
      } else if (lower.includes('m-pesa') || lower.includes('pesa') || lower.includes('payment') || lower.includes('malipo')) {
        replyText =
          language === 'sw'
            ? `Sisi tunatumia sera ya malipo ya ${buyer.paymentTerms}. Ukaguzi wa ubora ukikamilika tu, afisa wetu anatoa M-PESA papo hapo kabla ya lori kuondoka.`
            : `We operate strictly on ${buyer.paymentTerms}. Once produce weight and grade are checked, payment is transferred immediately via M-PESA before the truck departs.`;
      } else if (lower.includes('wapi') || lower.includes('shamba') || lower.includes('lami') || lower.includes('location')) {
        replyText =
          language === 'sw'
            ? `Safi sana! Ufikiaji rahisi wa barabara unatusaidia kuokoa muda wa usafiri. Tafadhali bonyeza 'Tuma Makubaliano' ili tuweke nafasi ya oda yako kwenye orodha ya wiki hii.`
            : `Excellent! Good road access ensures prompt collection. Please click 'Propose Terms' below so our dispatch team can schedule your farm slot.`;
      } else {
        replyText =
          language === 'sw'
            ? `Asante sana kwa ujumbe huu mkulima. Tuko tayari kushirikiana nawe. Tungependa kuanza na mzigo wa kwanza wiki hii. Ni siku gani inakufaa?`
            : `Thank you for these details. We are eager to partner with you. When is the best day this week for our procurement inspection?`;
      }

      const buyerMsg: ChatMessage = {
        id: `msg-buyer-${Date.now()}`,
        sender: 'buyer',
        text: replyText,
        timestamp: 'Sasa hivi',
        status: 'read',
      };

      setMessages((prev) => [...prev, buyerMsg]);

      // Read out buyer response if user has TTS enabled
      speakText(replyText);
    }, 1200);
  };

  // Send a regular chat message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const farmerMsg: ChatMessage = {
      id: `msg-farmer-${Date.now()}`,
      sender: 'farmer',
      text,
      timestamp: 'Sasa hivi',
      status: 'sent',
    };

    setMessages((prev) => [...prev, farmerMsg]);
    setInputText('');

    // Trigger auto reply
    triggerBuyerResponse(text);
  };

  // Send an official Deal Proposal / Supply Agreement Card
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();

    const proposalMsg: ChatMessage = {
      id: `msg-prop-${Date.now()}`,
      sender: 'farmer',
      text:
        language === 'sw'
          ? `📝 MAOMBI YA MKATABA WA MAZAO: Ninaomba kuwasambazia ${proposalData.crop} (${proposalData.quantity}) kwa bei ya KSh ${proposalData.priceKes.toLocaleString()} kwa kila kipimo. Malipo: ${proposalData.paymentTerm}. Mahali pa kuchukua: ${proposalData.pickupLocation}.`
          : `📝 OFFICIAL SUPPLY PROPOSAL: Offering ${proposalData.crop} (${proposalData.quantity}) at KSh ${proposalData.priceKes.toLocaleString()} per unit. Terms: ${proposalData.paymentTerm}. Pickup Location: ${proposalData.pickupLocation}.`,
      timestamp: 'Sasa hivi',
      status: 'sent',
      isOfferProposal: true,
      offerDetails: {
        crop: proposalData.crop,
        quantity: proposalData.quantity,
        priceKes: proposalData.priceKes,
        paymentTerm: proposalData.paymentTerm,
        pickupLocation: proposalData.pickupLocation,
        status: 'accepted',
      },
    };

    setMessages((prev) => [...prev, proposalMsg]);
    setShowProposalForm(false);
    showToast(language === 'sw' ? '✅ Makubaliano yametumwa kwa mnunuzi!' : '✅ Supply terms sent to buyer!');

    // Buyer accepts the proposal with enthusiasm
    setIsBuyerTyping(true);
    setTimeout(() => {
      setIsBuyerTyping(false);
      const acceptanceMsg: ChatMessage = {
        id: `msg-buyer-accept-${Date.now()}`,
        sender: 'buyer',
        text:
          language === 'sw'
            ? `🎉 NIMEKUBALI MAKUBALIANO HAYA! Tumeweka oda ya ${proposalData.crop} (${proposalData.quantity}) kwa bei ya KSh ${proposalData.priceKes.toLocaleString()}. Lori letu litafika ${proposalData.pickupLocation} tayari kwa malipo ya M-PESA papo hapo. Piga simu yangu au WhatsApp ili tutumiane GPS pin ya shamba.`
            : `🎉 DEAL ACCEPTED! We have locked in your order for ${proposalData.crop} (${proposalData.quantity}) @ KSh ${proposalData.priceKes.toLocaleString()}. Our logistics coordinator will reach out to confirm your GPS pin for pickup.`,
        timestamp: 'Sasa hivi',
        status: 'read',
      };
      setMessages((prev) => [...prev, acceptanceMsg]);
      speakText(
        language === 'sw'
          ? `Habari njema! Mnunuzi ${buyer.businessName} amekubali makubaliano yako ya kuuza ${proposalData.crop}.`
          : `Great news! ${buyer.businessName} has accepted your supply proposal for ${proposalData.crop}.`
      );
    }, 1500);
  };

  const cleanPhone = buyer.whatsapp.replace(/[^0-9]/g, '');
  const whatsAppDirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    language === 'sw'
      ? `Habari ${buyer.contactPerson}, nimekuwa nikiongea nawe kwenye Smart Shamba 360 chat kuhusu kusambaza ${buyer.cropsPurchased.join(', ')}...`
      : `Hello ${buyer.contactPerson}, following up from our Smart Shamba 360 chat regarding supplying ${buyer.cropsPurchased.join(', ')}...`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl w-full max-w-2xl h-[92vh] sm:h-[85vh] flex flex-col shadow-2xl border border-white/50 overflow-hidden">
        {/* 1. MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#15532E] via-[#1B5E20] to-[#2E7D32] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-base border border-white/30">
                <Building2 className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#15532E] rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base leading-tight text-white">
                  {buyer.businessName}
                </h3>
                {buyer.verified && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold border border-emerald-300/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>{buyer.contactPerson}</span>
                <span>•</span>
                <span className="text-[11px] text-emerald-200">
                  {language === 'sw' ? 'Hujibu chini ya dakika 15' : 'Replies in <15 mins'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick WhatsApp Escalate */}
            <a
              href={whatsAppDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Switch to WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${buyer.phone}`}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Direct call"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. SECURITY & ANTI-FRAUD TRUST BANNER */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {language === 'sw'
                ? 'Ulinzi wa Mkulima: Mnunuzi huyu amekaguliwa. Malipo ya M-PESA yanalipwa kabla ya kupakia mazao.'
                : 'Escrow Protection: Verified buyer. Instant M-PESA payout required prior to truck departure.'}
            </span>
          </div>

          <button
            onClick={() =>
              speakText(
                language === 'sw'
                  ? 'Mnunuzi huyu amethibitishwa na Smart Shamba 360. Usikubali kupeana mazao bila uthibitisho wa malipo ya M-PESA au hundi iliyopita.'
                  : 'This buyer is verified by Smart Shamba 360. Never release produce without direct M-PESA payment confirmation.'
              )
            }
            className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
            title="Sikiliza kanuni za usalama"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. CHAT MESSAGES BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isFarmer = msg.sender === 'farmer';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isFarmer ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isFarmer
                      ? 'bg-[#15532E] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {/* Proposal Card if this message is a structured deal offer */}
                  {msg.isOfferProposal && msg.offerDetails ? (
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20 mb-2 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-white/20 pb-1 font-bold text-emerald-200">
                        <span>📝 {language === 'sw' ? 'Mkataba Uliopendekezwa' : 'Proposed Supply Terms'}</span>
                        <span className="text-[10px] bg-emerald-400/30 px-2 py-0.5 rounded-full text-white">
                          {msg.offerDetails.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 text-emerald-100">
                        <div>Zao: <span className="font-bold text-white">{msg.offerDetails.crop}</span></div>
                        <div>Kiasi: <span className="font-bold text-white">{msg.offerDetails.quantity}</span></div>
                        <div>Bei: <span className="font-bold text-yellow-300">KSh {msg.offerDetails.priceKes.toLocaleString()}</span></div>
                        <div>Malipo: <span className="font-bold text-white">{msg.offerDetails.paymentTerm}</span></div>
                      </div>
                    </div>
                  ) : null}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Message Timestamp & Delivery Indicator */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  {isFarmer && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isBuyerTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl rounded-bl-xs border border-slate-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{buyer.contactPerson} {language === 'sw' ? 'anaandika majibu...' : 'is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. QUICK NEGOTIATION CHIPS */}
        <div className="bg-white px-3 pt-2 pb-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{language === 'sw' ? 'Jibu Haraka:' : 'Quick:'}</span>
          </span>

          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'sw' ? chip.sw : chip.en)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold border border-slate-200 transition-all shrink-0 cursor-pointer whitespace-nowrap"
            >
              {language === 'sw' ? chip.sw : chip.en}
            </button>
          ))}
        </div>

        {/* 5. STRUCTURED DEAL FORM POPUP MODAL (OPTIONAL TOGGLE) */}
        {showProposalForm && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 shrink-0 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'sw' ? 'Tuma Masharti ya Mauzo ya Mazao' : 'Send Formal Supply Offer'}</span>
              </h4>
              <button
                onClick={() => setShowProposalForm(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Zao</label>
                <select
                  value={proposalData.crop}
                  onChange={(e) => setProposalData({ ...proposalData, crop: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                >
                  {buyer.cropsPurchased.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Kiasi</label>
                <input
                  type="text"
                  value={proposalData.quantity}
                  onChange={(e) => setProposalData({ ...proposalData, quantity: e.target.value })}
                  placeholder="e.g. 40 Crates"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Bei (KSh / unit)</label>
                <input
                  type="number"
                  value={proposalData.priceKes}
                  onChange={(e) => setProposalData({ ...proposalData, priceKes: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-black text-[#15532E] text-xs"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#15532E] hover:bg-[#1B5E20] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span>{language === 'sw' ? 'Tuma Makubaliano' : 'Submit Deal'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. INPUT BAR & CONTROLS */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Offer Proposal Toggle Button */}
            <button
              type="button"
              onClick={() => setShowProposalForm(!showProposalForm)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                showProposalForm
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={language === 'sw' ? 'Pendekeza Mkataba wa Bei' : 'Propose Deal Terms'}
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">{language === 'sw' ? 'Mkataba' : 'Offer'}</span>
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'sw'
                  ? `Andika ujumbe au ongea kwa sauti...`
                  : `Type a message or speak hands-free...`
              }
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15532E]/30 focus:border-[#15532E]"
            />

            {/* Hands-Free Voice-to-Text Button */}
            <VoiceInputButton
              lang={language}
              size="md"
              onTranscript={(spokenText) => {
                setInputText((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#15532E] hover:bg-[#1B5E20] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold transition-all shrink-0 shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
