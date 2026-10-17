import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { animations } from './anim/registry';
import { EASE_OUT } from './lib/motion';

export default function App() {
  const [index, setIndex] = useState(0);
  const total = animations.length;
  const current = animations[index];

  const go = useCallback(
    (delta: number) => setIndex((prev) => (prev + delta + total) % total),
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
      <div className="app__grid" aria-hidden />
      <div className="app__vig" aria-hidden />
      <header className="hud">
        <div className="hud__meta">
          <span className="hud__cat">{current.category}</span>
          <h1 className="hud__name">{current.name}</h1>
        </div>
        <div className="hud__count">
          {String(index + 1).padStart(2, '0')}
          <span> / {String(total).padStart(2, '0')}</span>
        </div>
      </header>
      <main className="stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={current.id}
            className="scene"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.36, ease: EASE_OUT }}
          >
            <Component />
          </motion.section>
        </AnimatePresence>
      </main>
      <footer className="nav">
        <button className="nav__btn" onClick={() => go(-1)} aria-label="Previous animation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
            <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="nav__btn" onClick={() => go(1)} aria-label="Next animation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
            <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </footer>
      <div className="bar" aria-hidden>
        <motion.div
          className="bar__fill"
          animate={{ scaleX: (index + 1) / total }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          style={{ transformOrigin: '0% 50%' }}
        />
      </div>
    </div>
  );
}
