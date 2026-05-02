import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_SETTINGS = { work: 25, shortBreak: 5, longBreak: 15 };
const STORAGE_KEY = 'pomodoro-settings';
const SESSIONS_KEY = 'pomodoro-sessions';

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const loadSessions = () => {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
};

const getDuration = (sessionType, settings) => {
  switch (sessionType) {
    case 'Short Break': return settings.shortBreak * 60;
    case 'Long Break': return settings.longBreak * 60;
    default: return settings.work * 60;
  }
};

export const useTimer = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [sessionType, setSessionType] = useState('Work');
  const [timeLeft, setTimeLeft] = useState(() => loadSettings().work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(loadSessions);

  const timerEndHandled = useRef(false);
  const intervalRef = useRef(null);

  // Total duration for progress calculation
  const totalDuration = getDuration(sessionType, settings);
  const progress = 1 - timeLeft / totalDuration;

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerEndHandled.current = false;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft > 0]);

  // Handle timer end — guarded by ref to prevent multiple calls
  useEffect(() => {
    if (timeLeft === 0 && !timerEndHandled.current) {
      timerEndHandled.current = true;
      setIsRunning(false);

      if (sessionType === 'Work') {
        const nextCount = completedSessions + 1;
        setCompletedSessions(nextCount);
        localStorage.setItem(SESSIONS_KEY, nextCount.toString());

        if (nextCount % 4 === 0) {
          setSessionType('Long Break');
          setTimeLeft(settings.longBreak * 60);
        } else {
          setSessionType('Short Break');
          setTimeLeft(settings.shortBreak * 60);
        }
      } else {
        setSessionType('Work');
        setTimeLeft(settings.work * 60);
      }
    }
  }, [timeLeft, sessionType, completedSessions, settings]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    timerEndHandled.current = false;
    setTimeLeft(getDuration(sessionType, settings));
  }, [sessionType, settings]);

  const skip = useCallback(() => {
    setIsRunning(false);
    timerEndHandled.current = false;

    if (sessionType === 'Work') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      localStorage.setItem(SESSIONS_KEY, nextCount.toString());

      if (nextCount % 4 === 0) {
        setSessionType('Long Break');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setSessionType('Short Break');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setSessionType('Work');
      setTimeLeft(settings.work * 60);
    }
  }, [sessionType, completedSessions, settings]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    // If not running, update timeLeft to reflect new settings
    if (!isRunning) {
      setTimeLeft(getDuration(sessionType, newSettings));
    }
  }, [isRunning, sessionType]);

  const resetSessions = useCallback(() => {
    setCompletedSessions(0);
    localStorage.setItem(SESSIONS_KEY, '0');
  }, []);

  return {
    timeLeft,
    isRunning,
    sessionType,
    completedSessions,
    settings,
    progress,
    totalDuration,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    resetSessions,
  };
};
