export const focusIt = (
  target: EventTarget | null,
  selectorIt: string,
  selectorClosest: string | undefined = undefined
) => {
  const from = target as HTMLElement;
  if (from) {
    const closestAncestor = selectorClosest ? from.closest(selectorClosest) : from;

    if (closestAncestor) {
      const next = closestAncestor.querySelector(selectorIt) as HTMLElement;

      if (next) {
        next.focus();
      }
    }
  }
};
