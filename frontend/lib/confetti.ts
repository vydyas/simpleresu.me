import confetti from 'canvas-confetti';

// Create audio instance outside the function so it's only created once
const audio = new Audio('https://confettitherapy.com/assets/sounds/pop.mp3');
audio.volume = 0.3;
// Preload the audio
audio.load();

export const playConfettiWithSound = async () => {
  try {
    // Reset audio to start
    audio.currentTime = 0;
    // Use await to ensure the play promise is handled
    await audio.play();
  } catch (err) {
    console.log('Audio play failed:', err);
    // If audio fails, we might want to show a message to the user
    // about enabling audio permissions
  }
}

export const fireConfetti = () => {
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