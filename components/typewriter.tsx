'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  cursor?: boolean;
  cursorStyle?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  className?: string;
}

export function Typewriter({
  words,
  loop = true,
  cursor = true,
  cursorStyle = '|',
  typeSpeed = 100,
  deleteSpeed = 50,
  delaySpeed = 2000,
  className = '',
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, delaySpeed);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= words.length) {
              return loop ? 0 : prevIndex;
            }
            return nextIndex;
          });
        }
      }
    }, isPaused ? delaySpeed : isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentWordIndex, isDeleting, isPaused, words, typeSpeed, deleteSpeed, delaySpeed, loop]);

  return (
    <span className={className}>
      {currentText}
      {cursor && (
        <span className="animate-pulse text-blue-400">
          {cursorStyle}
        </span>
      )}
    </span>
  );
}
