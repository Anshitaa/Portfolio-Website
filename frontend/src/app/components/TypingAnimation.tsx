'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TypingAnimation({
  texts,
  className = '',
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseDuration = 2200,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'switching'>('typing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (!texts.length) return;

    const current = texts[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (charIndexRef.current < current.length) {
        timeout = setTimeout(() => {
          charIndexRef.current += 1;
          setDisplayText(current.slice(0, charIndexRef.current));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pauseDuration);
      }
    } else if (phase === 'deleting') {
      if (charIndexRef.current > 0) {
        timeout = setTimeout(() => {
          charIndexRef.current -= 1;
          setDisplayText(current.slice(0, charIndexRef.current));
        }, deletingSpeed);
      } else {
        setCurrentIndex(prev => (prev + 1) % texts.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-0.5 h-[1em] bg-purple-500 ml-0.5 align-middle animate-pulse" />
    </span>
  );
}
