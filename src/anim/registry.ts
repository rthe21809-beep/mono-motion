import type { AnimationEntry } from '../lib/types';
import {
  MagneticPull, RippleBloom, LiquidFill, SlideLabel,
  BorderDraw, SoftPress, MorphCapsule, GlitchSlice
} from './buttons';
import {
  LetterWave, Typewriter, LineReveal, Scramble,
  GradientSweep, DualMarquee, WordFlip, LetterRepel
} from './text';
import {
  Orbit, Bars, Blob, Conic,
  Pendulum, PixelGrid, DashRings, ElasticDots, WaveCanvas
} from './loaders';
import {
  TiltCard, Spotlight, FlipCard, FanCards,
  MagneticGrid, NoiseField, MorphSwitch, Odometer
} from './interactive';

export const animations: AnimationEntry[] = [
  { id: 'magnetic-pull', name: 'Magnetic Pull', category: 'Buttons', Component: MagneticPull },
  { id: 'ripple-bloom', name: 'Ripple Bloom', category: 'Buttons', Component: RippleBloom },
  { id: 'liquid-fill', name: 'Liquid Fill', category: 'Buttons', Component: LiquidFill },
  { id: 'slide-label', name: 'Slide Label', category: 'Buttons', Component: SlideLabel },
  { id: 'border-draw', name: 'Border Draw', category: 'Buttons', Component: BorderDraw },
  { id: 'soft-press', name: 'Soft Press', category: 'Buttons', Component: SoftPress },
  { id: 'morph-capsule', name: 'Morph Capsule', category: 'Buttons', Component: MorphCapsule },
  { id: 'glitch-slice', name: 'Glitch Slice', category: 'Buttons', Component: GlitchSlice },
  { id: 'letter-wave', name: 'Letter Wave', category: 'Text', Component: LetterWave },
  { id: 'typewriter', name: 'Typewriter', category: 'Text', Component: Typewriter },
  { id: 'line-reveal', name: 'Line Reveal', category: 'Text', Component: LineReveal },
  { id: 'scramble', name: 'Scramble', category: 'Text', Component: Scramble },
  { id: 'gradient-sweep', name: 'Gradient Sweep', category: 'Text', Component: GradientSweep },
  { id: 'dual-marquee', name: 'Dual Marquee', category: 'Text', Component: DualMarquee },
  { id: 'word-flip', name: 'Word Flip', category: 'Text', Component: WordFlip },
  { id: 'letter-repel', name: 'Letter Repel', category: 'Text', Component: LetterRepel },
  { id: 'orbit', name: 'Orbit', category: 'Loaders', Component: Orbit },
  { id: 'bars', name: 'Bars', category: 'Loaders', Component: Bars },
  { id: 'blob', name: 'Blob', category: 'Loaders', Component: Blob },
  { id: 'conic', name: 'Conic', category: 'Loaders', Component: Conic },
  { id: 'pendulum', name: 'Pendulum', category: 'Loaders', Component: Pendulum },
  { id: 'pixel-grid', name: 'Pixel Grid', category: 'Loaders', Component: PixelGrid },
  { id: 'dash-rings', name: 'Dash Rings', category: 'Loaders', Component: DashRings },
  { id: 'elastic-dots', name: 'Elastic Dots', category: 'Loaders', Component: ElasticDots },
  { id: 'wave-canvas', name: 'Wave Canvas', category: 'Loaders', Component: WaveCanvas },
  { id: 'tilt-card', name: 'Tilt Card', category: 'Interactive', Component: TiltCard },
  { id: 'spotlight', name: 'Spotlight', category: 'Interactive', Component: Spotlight },
  { id: 'flip-card', name: 'Flip Card', category: 'Interactive', Component: FlipCard },
  { id: 'fan-cards', name: 'Fan Cards', category: 'Interactive', Component: FanCards },
  { id: 'magnetic-grid', name: 'Magnetic Grid', category: 'Interactive', Component: MagneticGrid },
  { id: 'noise-field', name: 'Noise Field', category: 'Interactive', Component: NoiseField },
  { id: 'morph-switch', name: 'Morph Switch', category: 'Interactive', Component: MorphSwitch },
  { id: 'odometer', name: 'Odometer', category: 'Interactive', Component: Odometer }
];
