import confetti from 'canvas-confetti';

// Lazy initialize audio only when needed and only on client side
let audio: HTMLAudioElement | null = null;

const initAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  
  if (!audio) {
    const newAudio = new Audio('https://confettitherapy.com/assets/sounds/pop.mp3');
    newAudio.volume = 0.3;
    newAudio.load();
    audio = newAudio;
  }
  return audio;
};

export const playConfettiWithSound = async () => {
  await confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export const fireConfetti = () => {
  // Initialize audio on first use
  const audioInstance = initAudio();

  // Play sound if audio is available
  if (audioInstance) {
    // Reset audio to start if it's already playing
    audioInstance.currentTime = 0;
    audioInstance.play().catch(() => {
      // Silently handle any autoplay restrictions
      console.debug('Audio playback was prevented');
    });
  }

  // Call playConfettiWithSound but don't wait for it
  playConfettiWithSound();
  
  const count = 1200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { y: 0.7 },
  });

  fire(0.2, {
    spread: 60,
    origin: { y: 0.65 },
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    origin: { y: 0.6 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    origin: { y: 0.7 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin: { y: 0.65 },
  });
}; 