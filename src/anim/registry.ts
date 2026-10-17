import type { AnimationEntry } from '''../lib/types''';
import {
  MagneticPull, RippleField, LiquidRise, SplitStack,
  BorderTrace, DepthPress, MorphPill, SliceGlitch
} from '''./buttons''';
import {
  CharWave, TypeLoop, MaskReveal, Scramble,
  SheenText, CounterMarquee, FlipWords, LetterRepel
} from '''./text''';
import {
  OrbitDots, EqualizerBars, BlobMorph, ConicSweep,
  PendulumTrail, PixelWave, DashRing, ElasticDots, WaveField
} from '''./loaders''';
import {
  TiltCard, SpotlightCard, FlipCard, FanStack,
  MagneticGrid, NoiseField, MorphToggle, OdometerRoll
} from '''./interactive''';

export const animations: AnimationEntry[] = [
  { id: '''magnetic-pull''', name: '''Magnetic Pull''', category: '''Buttons''', Component: MagneticPull },
  { id: '''ripple-field''', name: '''Ripple Field''', category: '''Buttons''', Component: RippleField },
  { id: '''liquid-rise''', name: '''Liquid Rise''', category: '''Buttons''', Component: LiquidRise },
  { id: '''split-stack''', name: '''Split Stack''', category: '''Buttons''', Component: SplitStack },
  { id: '''border-trace''', name: '''Border Trace''', category: '''Buttons''', Component: BorderTrace },
  { id: '''depth-press''', name: '''Depth Press''', category: '''Buttons''', Component: DepthPress },
  { id: '''morph-pill''', name: '''Morph Pill''', category: '''Buttons''', Component: MorphPill },
  { id: '''slice-glitch''', name: '''Slice Glitch''', category: '''Buttons''', Component: SliceGlitch },

  { id: '''char-wave''', name: '''Character Wave''', category: '''Text''', Component: CharWave },
  { id: '''type-loop''', name: '''Type Loop''', category: '''Text''', Component: TypeLoop },
  { id: '''mask-reveal''', name: '''Mask Reveal''', category: '''Text''', Component: MaskReveal },
  { id: '''scramble''', name: '''Scramble Decode''', category: '''Text''', Component: Scramble },
  { id: '''sheen-text''', name: '''Sheen Chrome''', category: '''Text''', Component: SheenText },
  { id: '''counter-marquee''', name: '''Counter Marquee''', category: '''Text''', Component: CounterMarquee },
  { id: '''flip-words''', name: '''Flip Words''', category: '''Text''', Component: FlipWords },
  { id: '''letter-repel''', name: '''Letter Repel''', category: '''Text''', Component: LetterRepel },

  { id: '''orbit-dots''', name: '''Orbit Dots''', category: '''Loaders''', Component: OrbitDots },
  { id: '''equalizer-bars''', name: '''Equalizer Bars''', category: '''Loaders''', Component: EqualizerBars },
  { id: '''blob-morph''', name: '''Blob Morph''', category: '''Loaders''', Component: BlobMorph },
  { id: '''conic-sweep''', name: '''Conic Sweep''', category: '''Loaders''', Component: ConicSweep },
  { id: '''pendulum-trail''', name: '''Pendulum Trail''', category: '''Loaders''', Component: PendulumTrail },
  { id: '''pixel-wave''', name: '''Pixel Wave''', category: '''Loaders''', Component: PixelWave },
  { id: '''dash-ring''', name: '''Dash Ring''', category: '''Loaders''', Component: DashRing },
  { id: '''elastic-dots''', name: '''Elastic Dots''', category: '''Loaders''', Component: ElasticDots },
  { id: '''wave-field''', name: '''Wave Field''', category: '''Loaders''', Component: WaveField },

  { id: '''tilt-card''', name: '''Tilt Card''', category: '''Interactive''', Component: TiltCard },
  { id: '''spotlight-card''', name: '''Spotlight Card''', category: '''Interactive''', Component: SpotlightCard },
  { id: '''flip-card''', name: '''Flip Card''', category: '''Interactive''', Component: FlipCard },
  { id: '''fan-stack''', name: '''Fan Stack''', category: '''Interactive''', Component: FanStack },
  { id: '''magnetic-grid''', name: '''Magnetic Grid''', category: '''Interactive''', Component: MagneticGrid },
  { id: '''noise-field''', name: '''Noise Field''', category: '''Interactive''', Component: NoiseField },
  { id: '''morph-toggle''', name: '''Morph Toggle''', category: '''Interactive''', Component: MorphToggle },
  { id: '''odometer-roll''', name: '''Odometer Roll''', category: '''Interactive''', Component: OdometerRoll }
];
