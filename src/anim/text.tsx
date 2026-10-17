import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useFinePointer } from '../lib/hooks';
import { EASE_IN_OUT, EASE_OUT } from '../lib/motion';

export function LetterWave() {
  const word = 'RIPPLE';
  return (
    <div className="txt txt--wave" aria-label={word}>
      {word.split('').map((c, i) => (
        <motion.span
          key={i}
          className="txt__ch"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 1.8, delay: i * 0.055, ease: EASE_IN_OUT, repeat: Infinity, repeatDelay: 0.5 }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}

export function Typewriter() {
  const phrase = 'handmade motion';
  const [n, setN] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  useEffect(() => {
    const atEnd = n === phrase.length && dir === 1;
    const atStart = n === 0 && dir === -1;
    const wait = atEnd ? 1400 : atStart ? 700 : 68;
    const t = window.setTimeout(() => {
      if (dir === 1) {
        if (n < phrase.length) setN(n + 1);
        else setDir(-1);
      } else if (n > 0) setN(n - 1);
      else setDir(1);
    }, wait);
    return () => window.clearTimeout(t);
  }, [n, dir, phrase.length]);
  return (
    <div className="txt txt--mono" aria-label={phrase}>
      <span>{phrase.slice(0, n)}</span>
      <motion.span className="txt__caret" animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: 'linear' }} />
    </div>
  );
}

export function LineReveal() {
  const lines = ['Every frame', 'is drawn', 'by hand'];
  return (
    <div className="txt txt--lines">
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className="line-mask__inner"
            initial={{ y: '115%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.11, ease: EASE_OUT }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+-=/';

export function Scramble() {
  const target = 'DECODE';
  const [chars, setChars] = useState(target.split(''));
  const frame = useRef(0);
  const raf = useRef(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    frame.current = 0;
    const tick = () => {
      frame.current += 1;
      const f = frame.current;
      setChars(target.split('').map((c, i) => (f > i * 4 + 16 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])));
      if (f < target.length * 4 + 22) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <button className="txt txt--mono" onClick={run} aria-label="Replay">
      {chars.join('')}
    </button>
  );
}

export function GradientSweep() {
  return (
    <div className="txt__sweepWrap">
      <span className="txt__sweep">CHROME</span>
    </div>
  );
}

export function DualMarquee() {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(top.current, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
      gsap.fromTo(bottom.current, { xPercent: -50 }, { xPercent: 0, duration: 26, ease: 'none', repeat: -1 });
    });
    return () => ctx.revert();
  }, []);
  const row = Array.from({ length: 6 }).map((_, i) => (
    <span className="mq__item" key={i}>MONO<span className="mq__dot">/</span></span>
  ));
  return (
    <div className="mq">
      <div className="mq__row" ref={top}>{row}{row}</div>
      <div className="mq__row mq__row--outline" ref={bottom}>{row}{row}</div>
    </div>
  );
}

export function WordFlip() {
  const words = ['FLIP', 'TURN', 'SPIN', 'ROLL'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % words.length), 2000);
    return () => window.clearInterval(t);
  }, [words.length]);
  return (
    <div className="flip">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className="flip__word"
          initial={{ rotateX: -88, opacity: 0, y: '35%' }}
          animate={{ rotateX: 0, opacity: 1, y: '0%' }}
          exit={{ rotateX: 88, opacity: 0, y: '-35%' }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function LetterRepel() {
  const wrap = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const letters = useMemo(() => 'PUSH AWAY'.split(''), []);

  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-letter]'));
    let raf = 0;
    let px = -9999;
    let py = -9999;
    let t = 0;

    const apply = () => {
      raf = 0;
      t += 0.016;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = n.getBoundingClientRect();
        let ox = 0;
        let oy = 0;
        if (fine) {
          const dx = r.left + r.width / 2 - px;
          const dy = r.top + r.height / 2 - py;
          const d = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - d / 180);
          ox = (dx / (d || 1)) * force * 34;
          oy = (dy / (d || 1)) * force * 34;
        } else {
          oy = Math.sin(t * 1.6 + i * 0.5) * 4;
        }
        n.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
      }
    };

    const loop = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY; loop();
    };
    const onLeave = () => { px = -9999; py = -9999; loop(); };

    const id = window.setInterval(loop, fine ? 250 : 16);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  return (
    <div className="txt txt--repel" ref={wrap}>
      {letters.map((c, i) => (
        <span className="txt__repelCh" data-letter key={i}>{c === ' ' ? ' ' : c}</span>
      ))}
    </div>
  );
}
