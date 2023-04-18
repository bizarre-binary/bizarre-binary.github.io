export const motion = {
  duration: 300,
} as const;

export const delay = {
  // so that transition/animation would not be fired again before completion
  wait: motion.duration + 50,
} as const;
