import { LanguageCode } from '../types';

const LANG_VOICE_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  or: 'or-IN',
  es: 'es-ES',
  sw: 'sw-KE',
};

class AudioSpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private currentText: string = '';

  public subscribe(listener: (speaking: boolean, text: string) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(speaking: boolean, text: string) {
    this.isSpeaking = speaking;
    this.currentText = speaking ? text : '';
    this.listeners.forEach((cb) => cb(speaking, this.currentText));
  }

  public speak(text: string, lang: LanguageCode = 'en', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    this.stop();

    if (!text || text.trim() === '') return;

    // Clean markdown/special characters for speech
    const cleanText = text
      .replace(/[#*_`~[\]()]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = LANG_VOICE_MAP[lang] || 'en-US';
      utterance.lang = targetLang;
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      // Try finding suitable voice
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.notify(true, cleanText);
      };

      utterance.onend = () => {
        this.notify(false, '');
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.notify(false, '');
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error initiating speech:', err);
      this.notify(false, '');
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.notify(false, '');
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      currentText: this.currentText,
    };
  }
}

export const audioSpeech = new AudioSpeechManager();
