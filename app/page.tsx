'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const prompts = [
  "Where do you want to explore?",
  "Planning a proposal trip?",
  "Family vacation on a budget?",
  "Honeymoon ideas?",
  "Adventure or luxury?",
];

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(input)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0a0f1e' }}>

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-bold tracking-widest mb-12"
        style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}
      >
        RYOKO
      </motion.h1>

      {/* Rotating Prompt */}
      <div className="h-10 mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPrompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-center"
            style={{ color: '#9aa3b8' }}
          >
            {prompts[currentPrompt]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl px-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type anything..."
          className="w-full px-6 py-4 rounded-full text-white outline-none text-base"
          style={{
            backgroundColor: '#131929',
            border: '1px solid #c9a84c44',
            caretColor: '#c9a84c',
          }}
        />
      </motion.form>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-sm"
        style={{ color: '#4a5568' }}
      >
        Press Enter to begin your journey
      </motion.p>

    </main>
  );
}