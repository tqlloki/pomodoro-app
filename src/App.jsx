import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SessionIndicator from './components/SessionIndicator';
import Settings from './components/Settings';
import { useTimer } from './hooks/useTimer';
import { useNotification } from './hooks/useNotification';

const App = () => {
  const {
    timeLeft,
    isRunning,
    sessionType,
    completedSessions,
    settings,
    progress,
    start,
    pause,
    reset,
    skip,
    updateSettings,
  } = useTimer();

  const { notify } = useNotification();
  const [showSettings, setShowSettings] = useState(false);
  const prevSessionRef = useRef(sessionType);

  // Notify when session changes (timer ended)
  useEffect(() => {
    if (prevSessionRef.current !== sessionType) {
      const prevSession = prevSessionRef.current;
      prevSessionRef.current = sessionType;

      if (prevSession === 'Work') {
        notify('Break Time! 🎉', 'Great work! Time to take a break.');
      } else {
        notify('Focus Time! 🍅', 'Break is over. Let\'s get back to work!');
      }
    }
  }, [sessionType, notify]);

  // Update document title with timer
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
    document.title = `${timeStr} — ${sessionType} | Pomodoro`;
  }, [timeLeft, sessionType]);

  const getSessionClass = () => {
    switch (sessionType) {
      case 'Short Break': return 'session-short-break';
      case 'Long Break': return 'session-long-break';
      default: return 'session-work';
    }
  };

  return (
    <div className={`app ${getSessionClass()}`}>
      {/* Decorative background circles */}
      <div className="decoration-circle" />
      <div className="decoration-circle" />
      <div className="decoration-circle" />

      <h1 className="app-title">Pomodoro</h1>

      <div className="timer-card">
        <TimerDisplay
          timeLeft={timeLeft}
          progress={progress}
          sessionType={sessionType}
        />

        <Controls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSkip={skip}
          onSettingsOpen={() => setShowSettings(true)}
        />
      </div>

      <SessionIndicator
        completedSessions={completedSessions}
        sessionType={sessionType}
      />

      {showSettings && (
        <Settings
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;