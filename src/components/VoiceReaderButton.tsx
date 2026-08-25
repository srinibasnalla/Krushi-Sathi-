import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioSpeech } from '../utils/audioSpeech';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface VoiceReaderButtonProps {
  text: string;
  lang: LanguageCode;
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
  label?: string;
}

export const VoiceReaderButton: React.FC<VoiceReaderButtonProps> = ({
  text,
  lang,
  className = '',
  variant = 'compact',
  label,
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);
  const t = translations[lang] || translations.en;

  useEffect(() => {
    const unsubscribe = audioSpeech.subscribe((speaking, currentText) => {
      // Check if current speech text matches this element's text
      const cleanTarget = text.replace(/[#*_`~[\]()]/g, '').trim();
      if (speaking && currentText.includes(cleanTarget.substring(0, 30))) {
        setIsSpeakingThis(true);
      } else {
        setIsSpeakingThis(false);
      }
    });
    return unsubscribe;
  }, [text]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeakingThis) {
      audioSpeech.stop();
    } else {
      audioSpeech.speak(text, lang, () => setIsSpeakingThis(false));
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isSpeakingThis ? t.stopAudio : t.readAloud}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
          isSpeakingThis
            ? 'bg-amber-600 text-white animate-pulse shadow-amber-200'
            : 'bg-stone-100 text-stone-800 border border-stone-300/80 hover:bg-stone-200'
        } ${className}`}
      >
        {isSpeakingThis ? (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span>{t.stopAudio}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-stone-700" />
            <span>{label || t.readAloud}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer ${
          isSpeakingThis
            ? 'bg-amber-600 text-white shadow-amber-200 ring-2 ring-amber-400'
            : 'bg-stone-900 hover:bg-emerald-900 text-white shadow-xs'
        } ${className}`}
      >
        {isSpeakingThis ? (
          <>
            <VolumeX className="w-4 h-4 animate-bounce" />
            <span>{t.stopAudio}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{label || t.readAloud}</span>
            <Sparkles className="w-3.5 h-3.5 opacity-80 text-amber-300" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isSpeakingThis ? t.stopAudio : t.readAloud}
      className={`p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer ${
        isSpeakingThis
          ? 'bg-amber-500 text-white shadow-2xs ring-2 ring-amber-300 scale-105'
          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
      } ${className}`}
    >
      {isSpeakingThis ? (
        <VolumeX className="w-4 h-4 animate-pulse" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
};
