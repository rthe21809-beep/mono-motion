export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;
export const SPRING = { type: 'spring', stiffness: 400, damping: 34, mass: 0.8 } as const;
export const SPRING_SOFT = { type: 'spring', stiffness: 220, damping: 28, mass: 1 } as const;
export const SPRING_LIVELY = { type: 'spring', stiffness: 520, damping: 22, mass: 0.9 } as const;
export const T = { micro: 0.18, fast: 0.28, base: 0.42, slow: 0.62, scene: 0.38 } as const;
