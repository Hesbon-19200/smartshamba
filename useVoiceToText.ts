import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface definitions for TypeScript
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface UseVoiceToTextOptions {
  lang?: 'sw' | 'en';
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseVoiceToTextReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
  startListening: (options?: UseVoiceToTextOptions) => void;
  stopListening: () => void;
  toggleListening: (options?: UseVoiceToTextOptions) => void;
  resetTranscript: () => void;
}

export function useVoiceToText(defaultOptions: UseVoiceToTextOptions = {}): UseVoiceToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const activeCallbackRef = useRef<((t: string, isFinal: boolean) => void) | undefined>(defaultOptions.onResult);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognitionClass));
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop error if already stopped
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (options: UseVoiceToTextOptions = {}) => {
      setError(null);

      if (typeof window === 'undefined') return;

      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        const msg = 'Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.';
        setError(msg);
        options.onError?.(msg);
        return;
      }

      // Stop existing instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;

        const langPref = options.lang || defaultOptions.lang || 'sw';
        // Swahili Kenya (sw-KE) or English Kenya (en-KE) / US
        recognition.lang = langPref === 'sw' ? 'sw-KE' : 'en-KE';
        recognition.continuous = options.continuous ?? defaultOptions.continuous ?? false;
        recognition.interimResults = options.interimResults ?? defaultOptions.interimResults ?? true;
        recognition.maxAlternatives = 1;

        activeCallbackRef.current = options.onResult || defaultOptions.onResult;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const resultItem = event.results[i];
            const text = resultItem[0]?.transcript || '';

            if (resultItem.isFinal) {
              currentFinal += text;
            } else {
              currentInterim += text;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${currentFinal.trim()}` : currentFinal.trim();
              activeCallbackRef.current?.(updated, true);
              return updated;
            });
            setInterimTranscript('');
          } else {
            setInterimTranscript(currentInterim);
            activeCallbackRef.current?.(currentInterim, false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          let errorMsg = 'Hitilafu ya sauti. Tafadhali jaribu tena.';
          if (event.error === 'not-allowed') {
            errorMsg = 'Tafadhali ruhusu matumizi ya maikrofoni kwenye kivinjari chako (Microphone permission denied).';
          } else if (event.error === 'no-speech') {
            errorMsg = 'Hakuna sauti iliyosikika. Bonyeza tena na uongee kwa uwazi.';
          } else if (event.error === 'network') {
            errorMsg = 'Mtandao umekatika wakati wa kusikiliza sauti.';
          }

          setError(errorMsg);
          options.onError?.(errorMsg);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        const msg = err?.message || 'Speech recognition initialization failed';
        setError(msg);
        options.onError?.(msg);
        setIsListening(false);
      }
    },
    [defaultOptions]
  );

  const toggleListening = useCallback(
    (options?: UseVoiceToTextOptions) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(options);
      }
    },
    [isListening, startListening, stopListening]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
