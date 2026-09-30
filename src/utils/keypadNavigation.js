const DIRECTIONS = {
  ArrowUp: { axis: 'y', sign: -1 },
  ArrowDown: { axis: 'y', sign: 1 },
  ArrowLeft: { axis: 'x', sign: -1 },
  ArrowRight: { axis: 'x', sign: 1 },
};

const center = (rect, axis) =>
  axis === 'x' ? (rect.left + rect.right) / 2 : (rect.top + rect.bottom) / 2;

const orthogonalOverlap = (first, second, axis) => {
  const firstStart = axis === 'x' ? first.top : first.left;
  const firstEnd = axis === 'x' ? first.bottom : first.right;
  const secondStart = axis === 'x' ? second.top : second.left;
  const secondEnd = axis === 'x' ? second.bottom : second.right;
  return Math.max(0, Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart));
};

const directionalGap = (current, candidate, axis, sign) => {
  if (axis === 'x') {
    return sign > 0
      ? Math.max(0, candidate.left - current.right)
      : Math.max(0, current.left - candidate.right);
  }
  return sign > 0
    ? Math.max(0, candidate.top - current.bottom)
    : Math.max(0, current.top - candidate.bottom);
};

/**
 * Returns the closest button in a direction using rendered rectangles, so
 * buttons spanning multiple CSS grid columns participate in their real space.
 * Each candidate has the shape { element, rect }.
 */
export const findDirectionalButton = (currentRect, candidates, direction) => {
  const movement = DIRECTIONS[direction];
  if (!movement) return null;

  const orthogonalAxis = movement.axis === 'x' ? 'y' : 'x';
  const currentCenter = center(currentRect, movement.axis);
  const eligible = candidates
    .filter(({ rect }) => (center(rect, movement.axis) - currentCenter) * movement.sign > 0)
    .map((candidate, index) => ({
      ...candidate,
      order: index,
      overlap: orthogonalOverlap(currentRect, candidate.rect, movement.axis),
      gap: directionalGap(currentRect, candidate.rect, movement.axis, movement.sign),
      orthogonalDistance: Math.abs(
        center(candidate.rect, orthogonalAxis) - center(currentRect, orthogonalAxis),
      ),
    }));

  eligible.sort((first, second) =>
    second.overlap - first.overlap
    || first.gap - second.gap
    || first.orthogonalDistance - second.orthogonalDistance
    || first.order - second.order,
  );

  return eligible[0]?.element ?? null;
};
