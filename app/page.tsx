'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { row1, row2, row3 } from '@/lib/landingImages';

const prompts = [
  "Where do you want to explore?",
  "Planning a proposal trip?",
  "Family vacation on a budget?",
  "Honeymoon ideas?",
  "Adventure or luxury?",
];

function ImageRow({ images, direction }: { images: string[]; direction: 'left' | 'right' }) {
  const doubled = [...images, ...images];

  return (
    <div className="overflow-hidden w-full" style={{ height: '180px' }}>
      <motion.div
        className="flex gap-3"
        style={{ width: 'max-content' }}
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            style={{
              width: '280px',
              height: '170px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={`${src}?auto=compress&cs=tinysrgb&w=400`}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentPrompt((prev) => (prev + 1) % prompts.length);
  }, 3000);

  const focusTimer = setTimeout(() => {
    inputRef.current?.focus();
  }, 800);

  return () => {
    clearInterval(interval);
    clearTimeout(focusTimer);
  };
}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(input)}`);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0a0f1e' }}
    >
      {/* Image Rows Background */}
      <div
        className="absolute inset-0 flex flex-col justify-between py-4"
        style={{ opacity: 0.35 }}
      >
        <ImageRow images={row1} direction="right" />
        <ImageRow images={row2} direction="left" />
        <ImageRow images={row3} direction="right" />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0f1ecc 40%, #0a0f1e99 100%)',
        }}
      />

      {/* Animated orb behind logo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #c9a84c0a 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl font-bold tracking-widest mb-4"
          style={{
            color: '#c9a84c',
            fontFamily: 'Playfair Display, serif',
            textShadow: '0 0 60px #c9a84c44',
          }}
        >
          RYOKO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs tracking-widest mb-12"
          style={{ color: '#c9a84c66' }}
        >
          AI TRAVEL PLANNER
        </motion.p>

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

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="w-full max-w-xl px-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onClick={() => inputRef.current?.focus()}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
            placeholder="Type anything..."
            autoComplete="off"
            spellCheck={false}
            className="w-full px-6 py-4 rounded-full text-white outline-none text-base"
            style={{
              backgroundColor: '#131929cc',
              border: '1px solid #c9a84c44',
              caretColor: '#c9a84c',
              backdropFilter: 'blur(10px)',
            }}
          />
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm"
          style={{ color: '#4a5568' }}
        >
          Press Enter to begin your journey
        </motion.p>

      </div>
    </main>
  );
}