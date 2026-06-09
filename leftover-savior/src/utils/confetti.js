import confetti from 'canvas-confetti';

/**
 * Fire confetti celebration — cartoon mode only
 * In Apple mode, this is a no-op (controlled by caller)
 */
export function fireConfetti(theme = 'cartoon') {
  if (theme === 'cartoon') {
    // Apple mode: no confetti, just return silently
    return;
  }

  const colors = ['#FF8FAB', '#FFD166', '#7EC8E3', '#B5E5CF', '#FF6B6B', '#FFB347',
                  '#A8E6CF', '#FFD93D', '#FF8A80', '#84D8FF'];

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 30,
    colors,
    shapes: ['circle', 'square'],
    scalar: 1.2,
  };

  // Multi-burst for cartoon celebration feel
  confetti({
    ...defaults,
    origin: { y: 0.6 },
    particleCount: 80,
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      spread: 260,
      startVelocity: 35,
      origin: { y: 0.5, x: 0.2 },
      particleCount: 50,
    });
  }, 150);

  setTimeout(() => {
    confetti({
      ...defaults,
      spread: 260,
      startVelocity: 35,
      origin: { y: 0.5, x: 0.8 },
      particleCount: 50,
    });
  }, 300);

  setTimeout(() => {
    confetti({
      ...defaults,
      spread: 400,
      decay: 0.91,
      startVelocity: 40,
      origin: { y: 0.4 },
      particleCount: 60,
    });
  }, 450);
}

/**
 * Mini confetti burst (for small interactions)
 */
export function fireMiniConfetti(theme = 'cartoon') {
  if (theme === 'cartoon') return;

  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FF8FAB', '#7EC8E3', '#FFD166', '#B5E5CF'],
    shapes: ['circle'],
    scalar: 1,
  });
}
