import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCanvas } from '../lib/hooks';
import { EASE_IN_OUT } from '../lib/motion';

export function Orbit() {
  const rings = [
    { r: 44, dur: 3.2, dot: 7 },
    { r: 74, dur: 4.6, dot: 6 },
    { r: 104, dur: 6.4, dot: 5 }
  ];
  return (
    <div className="orbit">
      {rings.map((ring, i) => (
        <div
          className="orbit__ring"
          key={i}
          style={{ animationDuration: `${ring.dur}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
        >
          <span className="orbit__dot" style={{ transform: `translateX(${ring.r}px)`, width: ring.dot, height: ring.dot }} />
        </div>
      ))}
      <span className="orbit__core" />
    </div>
  );
}

export function Bars() {
  const list = Array.from({ length: 9 });
  return (
    <div className="bars">
      {list.map((item, i) => (
        <span className="bars__bar" key={i} style={{ animationDelay: `${i * -0.14}s` }} />
      ))}
    </div>
  );
}

export function Blob() {
  return (
    <motion.div
      className="blob"
      animate={{
        borderRadius: [
          '60% 40% 44% 56% / 46% 56% 44% 54%',
          '42% 58% 60% 40% / 60% 40% 60% 40%',
          '60% 40% 44% 56% / 46% 56% 44% 54%'
        ],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 11, ease: EASE_IN_OUT, repeat: Infinity }}
    />
  );
}

export function Conic() {
  return (
    <div className="conicWrap">
      <div className="conic" />
      <div className="conic conic--inner" />
    </div>
  );
}

export function Pendulum() {
  const arms = [0, 1, 2, 3, 4];
  return (
    <svg className="pend" viewBox="0 0 200 200" width="200" height="200" aria-hidden>
      {arms.map((i) => (
        <g key={i} className="pend__arm" style={{ animationDelay: `${i * -0.1}s`, opacity: 1 - i * 0.18 }}>
          <line x1="100" y1="26" x2="100" y2="148" stroke="#ededf0" strokeWidth={2 - i * 0.3} strokeLinecap="round" />
          <circle cx="100" cy="148" r={8.5 - i * 1.3} fill="#ededf0" />
        </g>
      ))}
      <circle cx="100" cy="26" r="3" fill="#4a4a55" />
    </svg>
  );
}

export function PixelGrid() {
  const N = 9;
  const total = N * N;
  const cells = [];
  for (let i = 0; i < total; i++) {
    cells.push({ i, delay: (Math.floor(i / N) + (i % N)) * 70 });
  }
  return (
    <div className="px" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {cells.map((c) => (
        <span className="px__cell" key={c.i} style={{ animationDelay: `${c.delay}ms` }} />
      ))}
    </div>
  );
}

export function DashRings() {
  return (
    <svg className="dash" viewBox="0 0 200 200" width="200" height="200" aria-hidden>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#1a1a20" strokeWidth="2" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="#ededf0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="12 26" className="dash__a" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#ededf0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="6 20" className="dash__b" opacity="0.7" />
      <circle cx="100" cy="100" r="38" fill="none" stroke="#ededf0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="34 24" className="dash__c" opacity="0.45" />
    </svg>
  );
}

export function ElasticDots() {
  const list = [0, 1, 2, 3, 4, 5];
  return (
    <div className="elastic">
      {list.map((i) => (
        <span className="elastic__dot" key={i} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

export function WaveCanvas() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const gap = 24;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    const cx = w / 2;
    const cy = h / 2;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * gap;
        const py = y * gap;
        const d = Math.hypot(px - cx, py - cy);
        const wave = Math.sin(d * 0.03 - t * 1.9) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 1 + wave * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237,237,240,${(0.07 + wave * 0.6).toFixed(3)})`;
        ctx.fill();
      }
    }
  }, []);
  const ref = useCanvas(draw);
  return <canvas ref={ref} className="cv cv--wave" />;
}
