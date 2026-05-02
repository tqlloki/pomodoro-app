import { useEffect, useRef, useCallback } from 'react';

export const useNotification = () => {
  const audioContextRef = useRef(null);
  const permissionRef = useRef('default');

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        permissionRef.current = perm;
      });
    } else if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, []);

  // Generate alarm sound using Web Audio API
  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      const playBeep = (startTime, frequency, duration) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play a pleasant 3-beep pattern
      const now = ctx.currentTime;
      playBeep(now, 830, 0.15);
      playBeep(now + 0.2, 830, 0.15);
      playBeep(now + 0.4, 1050, 0.3);

    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, []);

  // Show browser notification
  const notify = useCallback((title, body) => {
    playSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '🍅',
        badge: '🍅',
        tag: 'pomodoro-timer',
        requireInteraction: true,
      });

      setTimeout(() => notification.close(), 5000);
    }
  }, [playSound]);

  return { notify, playSound };
};
