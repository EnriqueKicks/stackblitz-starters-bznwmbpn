export function getStars(score, total) {
  const percentage = (score / total) * 100;

  if (percentage === 100) return 3;
  if (percentage >= 70) return 2;
  return 1;
}
