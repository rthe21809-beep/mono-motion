import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { animations } from './anim/registry';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function App() {
  const [index, setIndex] = useState(0);
  const total = animations.length;
  const current = animations[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const Component = current.Component;

  return (
    <div className="app">
      <div className="stage" aria-hidden />
      <div className="vignette" aria-hidden />
      <header className="hud hud--top">
        <div className="hud__meta">
          <span className="hud__cat">{current.category}</span>
          <h1 className="hud__name">{current.name}</h1>
        </div>
        <div className="hud__count" aria-hidden>
          {String(index + 1).padStart(2, '0')}
          <span> / {String(total).padStart(2, '0')}</span>
        </div>
      </header>
      <main className="viewport">
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            className="scene"
            initial={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.012, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Component />
          </motion.section>
        </AnimatePresence>
      </main>
      <footer className="hud hud--bottom">
        <button className="navbtn" onClick={() => go(-1)} aria-label="Previous animation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
            <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="navbtn" onClick={() => go(1)} aria-label="Next animation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
            <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </footer>
      <div className="progress" aria-hidden>
        <motion.div
          className="progress__bar"
          animate={{ scaleX: (index + 1) / total }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ transformOrigin: '0% 50%' }}
        />
      </div>
    </div>
  );
}
