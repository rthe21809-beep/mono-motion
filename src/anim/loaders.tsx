import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCanvas } from '../lib/hooks';

/* 17 - Orbit Dots */
export function OrbitDots() {
  const rings = [
    { r: 46, d: 2.6, s: 7 },
    { r: 76, d: 4.1, s: 6 },
    { r: 106, d: 6.2, s: 5 }
  ];
  return (
    <div className="ld-orbit">
      {rings.map((ring, i) => (
        <div
          className="ld-orbit__ring"
          key={i}
          style={{
            animationDuration: ring.d + 's',
            animationDirection: i % 2 ? 'reverse' : 'normal'
          }}
        >
          <span
            className="ld-orbit__dot"
            style={{ transform: 'translateX(' + ring.r + 'px)', width: ring.s, height: ring.s }}
          />
        </div>
      ))}
      <span className="ld-orbit__core" />
    </div>
  );
}

/* 18 - Equalizer Bars */
export function EqualizerBars() {
  return (
    <div className="ld-eq">
      {Array.from({ length: 9 }).map((_, i) => (
        <span className="ld-eq__bar" key={i} style={{ animationDelay: i * -0.135 + 's' }} />
      ))}
    </div>
  );
}

/* 19 - Blob Morph */
export function BlobMorph() {
  return (
    <motion.div
      className="ld-blob"
      animate={{
        borderRadius: [
          '58% 42% 47% 53% / 47% 55% 45% 53%',
          '43% 57% 62% 38% / 61% 39% 61% 39%',
          '58% 42% 47% 53% / 47% 55% 45% 53%'
        ],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
    />
  );
}

/* 20 - Conic Sweep */
export function ConicSweep() {
  return (
    <div className="ld-conicWrap">
      <div className="ld-conic" />
      <div className="ld-conic ld-conic--inner" />
    </div>
  );
}

/* 21 - Pendulum Trail */
export function PendulumTrail() {
  return (
    <div className="ld-pend">
      <svg className="ld-pend__svg" viewBox="0 0 200 200" width="200" height="200">
        {[0, 1, 2, 3, 4].map((i) => (
          <g
            key={i}
            className="ld-pend__arm"
            style={{ animationDelay: i * -0.09 + 's', opacity: 1 - i * 0.17 }}
          >
            <line x1="100" y1="20" x2="100" y2="150" stroke="#ededf0" strokeWidth={2 - i * 0.28} strokeLinecap="round" />
            <circle cx="100" cy="150" r={9 - i * 1.3} fill="#ededf0" />
          </g>
        ))}
        <circle cx="100" cy="20" r="3.5" fill="#6b6b75" />
      </svg>
    </div>
  );
}

/* 22 - Pixel Wave */
export function PixelWave() {
  const N = 11;
  const cells = Array.from({ length: N * N }, (_, i) => {
    const r = Math.floor(i / N);
    const c = i % N;
    return { i, delay: (r + c) * 62 };
  });
  return (
    <div className="ld-px" style={{ gridTemplateColumns: 'repeat(' + N + ', 1fr)' }}>
      {cells.map((cell) => (
        <span className="ld-px__cell" key={cell.i} style={{ animationDelay: cell.delay + 'ms' }} />
      ))}
    </div>
  );
}

/* 23 - Dash Ring */
export function DashRing() {
  return (
    <svg className="ld-dash" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="82" fill="none" stroke="#1e1e24" strokeWidth="2" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="#ededf0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" className="ld-dash__a" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#ededf0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 18" className="ld-dash__b" opacity="0.75" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="#ededf0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="40 26" className="ld-dash__c" opacity="0.5" />
    </svg>
  );
}

/* 24 - Elastic Dots */
export function ElasticDots() {
  return (
    <div className="ld-elastic">
      {Array.from({ length: 6 }).map((_, i) => (
        <span className="ld-elastic__dot" key={i} style={{ animationDelay: i * 0.11 + 's' }} />
      ))}
    </div>
  );
}

/* 25 - Wave Field */
export function WaveField() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const gap = 26;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * gap;
        const py = y * gap;
        const d = Math.hypot(px - w / 2, py - h / 2);
        const wave = Math.sin(d * 0.028 - t * 2.1) * 0.5 + 0.5;
        const r = 1 + wave * 3.1;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,237,240,' + (0.08 + wave * 0.62).toFixed(3) + ')';
        ctx.fill();
      }
    }
  }, []);

  const ref = useCanvas(draw);
  return <canvas ref={ref} className="ld-canvas" />;
}
